const { Metadata, credentials } = require("@grpc/grpc-js");
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-grpc");

let sdk = null;

exports.initTracing = (apiKey, dataset) => {
  const metadata = new Metadata();
  metadata.set("x-honeycomb-team", apiKey);
  metadata.set("x-honeycomb-dataset", dataset);

  const traceExporter = new OTLPTraceExporter({
    url: "grpc://api.honeycomb.io:443/",
    credentials: credentials.createSsl(),
    metadata,
  });

  sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "html-dom-trace",
    }),
    traceExporter,
    instrumentations: [],
  });

  return sdk
    .start()
    .then(() => console.log("Tracing initialized"))
    .catch((error) => console.log("Error initializing tracing", error));
};

exports.shutdownTracing = () => {
  return sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error));
};
