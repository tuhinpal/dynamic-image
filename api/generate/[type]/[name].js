const { readFileSync } = require("fs");
const { join } = require("path");
const templateEngine = require("../../../lib/template-engine");
const pngScreenshot = require("../../../lib/png-screenshot");
const getRootPath = require("../../../helpers/get-root-path");
const puppPage = require("../../../lib/pupp-page");
const addSvgScript = require("../../../helpers/add-svg-script");
const { setHeader, headers } = require("../../../helpers/set-header");
const logger = require("../../../logger");

module.exports = async function (req, res) {
  const { type, name, icon, title, content } = req.query;
  logger(req);

  const base = getRootPath();
  try {
    var template = readFileSync(
      join(
        __dirname,
        "..",
        "..",
        "..",
        "template",
        `${name.replace(`.${type}`, "")}.html` // remove .png/svg/html
      ),
      "utf-8"
    );

    template = templateEngine(template, {
      icon: icon || "",
      title: title || "Dynamic Image.",
      content: content || "Dynamically generate images",
      base,
    });

    if (type === "html") {
      // Requested html
      setHeader(res, headers);
      res.status(200).end(template);
    } else if (type === "svg") {
      // Requested SVG
      template = addSvgScript(template);

      const page = await puppPage();
      page.on("console", (msg) => {
        // listen to console logs
        if (msg.text().includes("<svg")) {
          setHeader(res, {
            // set headers if successfully get the svg
            ...headers,
            "Content-Type": "image/svg+xml",
          });
          res.status(200).end(msg.text());
        }
      });
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setContent(template, { waitUntil: "domcontentloaded" });
    } else if (type === "png") {
      // Requested PNG
      const file = await pngScreenshot(template);
      setHeader(res, {
        // set headers if successfully get the png
        ...headers,
        "Content-Type": "image/png",
      });
      res.status(200).end(file);
    } else {
      setHeader(res, headers);
      res
        .status(404)
        .json({ message: "Type not found, Only supports png, svg, html" });
    }
  } catch (e) {
    if (!e.toString().includes("ENOENT")) {
      delete headers["Cache-Control"];
    }

    setHeader(res, headers);

    res.status(404).json({
      message: e.toString().includes("ENOENT")
        ? "Template not found"
        : e.toString(),
    });
  }
};
