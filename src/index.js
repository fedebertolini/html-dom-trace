#!/usr/bin/env node

const sade = require("sade");
const axios = require("axios");
const { parseHtml } = require("./parse");
const { createTrace } = require("./trace");
const { initTracing, shutdownTracing } = require("./tracingSdk");
const pck = require("../package.json");

sade("html-dom-trace <url>", true)
  .version(pck.version)
  .describe(
    "Fetch a HTML document, model the DOM as a Trace and send it to HoneyComb"
  )
  .example(
    "https://www.example.com --hc-key=1234567890 --hc-dataset=html-traces"
  )
  .option("--hc-key", "HoneyComb API Key")
  .option("--hc-dataset", "HoneyComb Dataset name", "html-dom-trace")
  .action(async (url, opts) => {
    try {
      await initTracing(opts["hc-key"], opts["hc-dataset"]);

      const response = await axios.get(url);
      const htmlElem = parseHtml(response.data);
      createTrace(htmlElem, url);

      await shutdownTracing();
    } catch (err) {
      console.error(err);
    }
  })
  .parse(process.argv);
