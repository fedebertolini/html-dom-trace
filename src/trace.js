const { context, trace } = require("@opentelemetry/api");

exports.createTrace = (htmlElem, url) => {
  const now = Date.now();
  const rootSpan = traceRootSpan(url, now);
  const rootContext = getSpanContext(rootSpan);

  traceHtmlNode(htmlElem, now, rootContext);

  rootSpan.end(now + htmlElem.estimatedSize);
};

const traceRootSpan = (url, startTimestamp) => {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("html-trace", {
    attributes: { url },
    startTime: startTimestamp,
  });
  return span;
};

const traceHtmlNode = (node, startTimestamp, parentContext) => {
  const tracer = trace.getTracer("default");
  const spanOptions = {
    attributes: {
      ...node.attributes,
      size: node.estimatedSize,
    },
    startTime: startTimestamp,
  };
  const span = tracer.startSpan(node.tagName, spanOptions, parentContext);
  const spanContext = getSpanContext(span);

  node.children.forEach((child) => {
    traceHtmlNode(child, startTimestamp, spanContext);
  });

  span.end(startTimestamp + node.estimatedSize);
};

const getSpanContext = (span) => trace.setSpan(context.active(), span);
