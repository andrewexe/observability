// tracing.js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { PeriodicExportingMetricReader, ConsoleMetricExporter } = require('@opentelemetry/sdk-metrics');

 // **NEW**: HTTP/protobuf OTLP exporter
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');

// instrumentations
const { ExpressInstrumentation } = require('opentelemetry-instrumentation-express');
const { HttpInstrumentation }    = require('@opentelemetry/instrumentation-http');
const { MongoDBInstrumentation } = require('@opentelemetry/instrumentation-mongodb');

const sdk = new NodeSDK({
  // this is what Jaeger will see as your service name
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'todo-service',
  }),

  // send spans via HTTP/protobuf to localhost:4318/v1/traces
  traceExporter: new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',  
  }),

  // console metrics for now (optional)
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
  }),

  instrumentations: [
    getNodeAutoInstrumentations(),
    new ExpressInstrumentation(),
    new HttpInstrumentation(),
    new MongoDBInstrumentation(),
  ],
});

sdk.start();

