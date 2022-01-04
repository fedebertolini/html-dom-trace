const { context, trace } = require("@opentelemetry/api");

exports.createTrace = (htmlElem) => {
  traceHtmlNode(htmlElem, Date.now());
};

function traceHtmlNode(node, startTimestamp, parentContext) {
  const tracer = trace.getTracer("default");
  const spanOptions = {
    attributes: {
      ...node.attributes,
      size: node.estimatedSize,
    },
    startTime: startTimestamp,
  };
  const span = tracer.startSpan(node.tagName, spanOptions, parentContext);
  const spanContext = trace.setSpan(context.active(), span);

  node.children.forEach((child) => {
    traceHtmlNode(child, startTimestamp, spanContext);
  });

  span.end(startTimestamp + node.estimatedSize);
}
