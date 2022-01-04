#!/usr/bin/env node

const sade = require("sade");
const pck = require("../package.json");

sade("html-dom-trace <url>", true)
  .version(pck.version)
  .describe("Fetch and parse a HTML document and model the DOM as a Trace")
  .example(
    "https://www.example.com --hc-key=1234567890 --hc-dataset=html-traces"
  )
  .option("--hc-key", "HoneyComb API Key")
  .option("--hc-dataset", "HoneyComb Dataset name", "html-dom-trace")
  .action((url, opts) => {
    console.log(url, opts);
  })
  .parse(process.argv);
