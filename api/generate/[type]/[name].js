const { readFileSync } = require("fs");
const { join } = require("path");
const templateEngine = require("../../../lib/template-engine");
const pngScreenshot = require("../../../lib/png-screenshot");
const getRootPath = require("../../../helpers/get-root-path");
const puppPage = require("../../../lib/pupp-page");
const addSvgScript = require("../../../helpers/add-svg-script");

module.exports = async function (req, res) {
  const { type, name, icon, title, content } = req.query;
  const base = getRootPath();
  try {
    var template = readFileSync(
      join(__dirname, "..", "..", "..", "template", `${name}.html`),
      "utf-8"
    );

    template = templateEngine(template, {
      icon: icon || `${base}/icon/think.svg`,
      title: title || "Dynamic Image.",
      content: content || "Dynamically generate images",
      base,
    });
    res.setHeader(
      "cache-control",
      "public, immutable, no-transform, max-age=86400"
    );
    if (type === "html") {
      // Requested html
      res.status(200).send(template);
    } else if (type === "svg") {
      // Requested SVG
      template = addSvgScript(template);

      const page = await puppPage();
      page.on("console", (msg) => {
        // listen to console logs
        if (msg.text().includes("<svg")) {
          res.setHeader("Content-Type", "image/svg+xml");
          res.setHeader(
            "cache-control",
            "public, immutable, no-transform, max-age=86400"
          );
          res.status(200).end(msg.text());
        }
      });
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setContent(template, { waitUntil: "domcontentloaded" });
    } else if (type === "png") {
      // Requested PNG
      const file = await pngScreenshot(template);
      res.setHeader("Content-Type", "image/png");
      res.status(200).send(file);
    } else {
      res
        .status(404)
        .json({ message: "Type not found, Only supports png, svg, html" });
    }
  } catch (e) {
    res.status(404).json({
      message: e.toString().includes("ENOENT")
        ? "Template not found"
        : e.toString(),
    });
  }
};
