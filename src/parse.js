const parse = require("parse5");

exports.parseHtml = (htmlString) => {
  const document = parse.parse(htmlString);
  const htmlElement = findNodeChild(document, "html");
  return parseTag(htmlElement);
};

const findNodeChild = (element, nodeName) =>
  element.childNodes.find((node) => node.nodeName === nodeName);

const parseTag = (tagNode) => {
  const tag = {
    tagName: tagNode.tagName,
    attributes: {},
    estimatedSize: 0,
    children: [],
  };
  tagNode.attrs.forEach((attr) => {
    tag.attributes[`attr_${attr.name}`] = attr.value;
    tag.estimatedSize += attr.name.length + (attr.value || "").length + 4;
  });

  tagNode.childNodes.forEach((childNode) => {
    if (childNode.nodeName === "#text") {
      const size = childNode.value.trim().length;
      tag.estimatedSize += size;
    } else if (childNode.nodeName !== "#comment") {
      tag.children.push(parseTag(childNode));
    }
  });

  tag.estimatedSize += tag.children.reduce(
    (size, node) => size + node.estimatedSize,
    0
  );
  tag.estimatedSize += tag.tagName.length * 2 + 5;

  return tag;
};
