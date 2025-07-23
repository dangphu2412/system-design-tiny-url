import * as opentelemetry from '@opentelemetry/sdk-node';
import { diag, DiagConsoleLogger } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import 'dotenv/config';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';

const { credentials } = require('@grpc/grpc-js');

diag.setLogger(new DiagConsoleLogger());

const logExporter = new OTLPLogExporter({
  url: process.env.OLTP_EXPORTER, // e.g., 'http://localhost:4317'
  credentials: credentials.createInsecure(),
});

const logRecordProcessor = new BatchLogRecordProcessor(logExporter);

const sdk = new opentelemetry.NodeSDK({
  serviceName: 'tinyurl-service',
  instrumentations: getNodeAutoInstrumentations({
    // Disable noisy instrumentations
    '@opentelemetry/instrumentation-fs': { enabled: false },
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OLTP_EXPORTER,
    credentials: credentials.createInsecure(),
  }),
  logRecordProcessor: logRecordProcessor
});

try {
  sdk.start();
  diag.info('OpenTelemetry automatic instrumentation started successfully');
} catch (error) {
  diag.error(
    'Error initializing OpenTelemetry SDK. Your application is not instrumented and will not produce telemetry',
    error,
  );
}

// Gracefully shut down the SDK to flush telemetry when the program exits
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => diag.debug('OpenTelemetry SDK terminated'))
    .catch((error) => diag.error('Error terminating OpenTelemetry SDK', error));
});
