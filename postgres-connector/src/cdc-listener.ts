// src/cdc-listener/cdc-listener.service.ts
import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
  Logger,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  LogicalReplicationService,
  PgoutputPlugin,
} from 'pg-logical-replication';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { PostEntity } from './entity';

type Log = {
  tag: string;
  relation: {
    tag: string;
    relationOid: number;
  };
  new: PostEntity;
};

@Injectable()
export class CdcListenerService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(CdcListenerService.name);
  private replicationService: LogicalReplicationService;
  private isRunning = false;

  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  onModuleInit() {
    this.logger.log('Initializing CDC Listener Service...');
    this.startListening();
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.log(
      `Received ${signal || 'shutdown signal'}. Stopping CDC Listener...`,
    );
    this.isRunning = false;
    if (this.replicationService) {
      try {
        await this.replicationService.stop();
        this.logger.log('Logical replication stopped gracefully.');
      } catch (error) {
        this.logger.error('Error stopping logical replication:', error);
      }
    }
  }

  private startListening() {
    this.replicationService = new LogicalReplicationService(
      {
        host: this.configService.get<string>('PG_REPLICATION_HOST'),
        port: this.configService.get<number>('PG_REPLICATION_PORT'),
        user: this.configService.get<string>('PG_REPLICATION_USER'),
        password: this.configService.get<string>('PG_REPLICATION_PASSWORD'),
        database: this.configService.get<string>('PG_REPLICATION_DATABASE'),
        replication: 'database' as const, // Crucial for replication protocol
        // Add SSL options if needed: ssl: { rejectUnauthorized: false } or provide certs
      },
      {
        acknowledge: { auto: true, timeoutSeconds: 10 }, // Let the library handle ACKs via heartbeats mostly
      },
    );
    this.setupEventHandlers();

    const plugin = new PgoutputPlugin({
      protoVersion: 1,
      publicationNames: [
        this.configService.getOrThrow<string>('PG_PUBLICATION_NAME'),
      ],
    });
    const slotName = this.configService.getOrThrow<string>('PG_SLOT_NAME');

    // **IMPORTANT: Slot Management**
    // Production apps need robust logic to check if the slot exists and create it
    // securely if needed, handling potential errors (e.g., race conditions, permissions).
    // This example assumes the slot exists. If not, subscribe will likely fail.
    // You might need to create it manually first using SQL:
    // SELECT pg_create_logical_replication_slot('your_slot_name', 'pgoutput');

    this.replicationService
      .subscribe(plugin, slotName)
      .then(() => {
        this.logger.log(
          `Successfully subscribed to slot "${slotName}". Listening for changes...`,
        );
      })
      .catch((err) => {
        this.logger.error(`Failed to subscribe to slot "${slotName}":`, err);
      });
    this.isRunning = true;
  }

  private setupEventHandlers() {
    this.replicationService.on('data', async (lsn: string, log: Log) => {
      // Log the raw data for inspection
      this.logger.debug(`[LSN: ${lsn}] Received Data - Tag: ${log.tag}`);

      // Provide more detailed logging for actual changes
      if (['insert', 'update', 'delete'].includes(log.tag)) {
        await this.cache.set(`totes:${log.new.id}`, log.new);
        this.logger.log(`Update cached ${log.new.id}`);
      } else if (log.tag === 'commit') {
        this.logger.verbose(`[LSN: ${lsn}] Transaction Commit.`);
      }
      // Note: LSN acknowledgement is handled mostly automatically by the library's heartbeats
      // based on the 'acknowledge' config provided during instantiation.
    });

    this.replicationService.on('error', (err: Error) => {
      this.logger.error('Logical Replication Error:', err);
      this.isRunning = false;
      // Attempt reconnection after a delay? Needs robust logic.
      // For simplicity, we stop here in the example upon error.
      // Consider restarting the NestJS app via orchestrator (k8s, pm2) on fatal errors.
      this.replicationService
        .stop()
        .catch((stopErr) =>
          this.logger.error('Error stopping after error:', stopErr),
        );
    });

    this.replicationService.on(
      'heartbeat',
      (lsn: string, timestamp: number, shouldRespond: boolean) => {
        this.logger.verbose(
          `Heartbeat received (LSN: ${lsn}). Respond: ${shouldRespond}`,
        );
        // Acknowledge is handled automatically by the service config,
        // but you could manually acknowledge here if needed based on shouldRespond.
        // if (shouldRespond) { this.replicationService.acknowledge(lsn); }
      },
    );
  }
}
