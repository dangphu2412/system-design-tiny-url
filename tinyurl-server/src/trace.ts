import * as opentelemetry from '@opentelemetry/sdk-node';
import { diag, DiagConsoleLogger } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import 'dotenv/config';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
const { credentials } = require('@grpc/grpc-js')
// [START opentelemetry_instrumentation_setup_opentelemetry]

diag.setLogger(new DiagConsoleLogger());

const sdk = new opentelemetry.NodeSDK({
  instrumentations: getNodeAutoInstrumentations({
    // Disable noisy instrumentations
    '@opentelemetry/instrumentation-fs': { enabled: false },
  }),
  // resourceDetectors: getResourceDetectorsFromEnv(),
  // metricReader: getMetricReader(),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OLTP_EXPORTER,
    credentials: credentials.createInsecure(),
  }),
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

// [END opentelemetry_instrumentation_setup_opentelemetry]
