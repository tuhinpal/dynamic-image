const { readdirSync } = require("fs");
const { join } = require("path");
const { setHeader, headers } = require("../../helpers/set-header");
const qs = require("qs");
const supportedTypes = ["png", "svg", "html"];

module.exports = function (req, res) {
  var query = req.query;
  var type = query.type;
  delete query.type;
  var options = qs.stringify(query);

  var getDir = readdirSync(join(__dirname, "..", "..", "template"));
  var templates = getDir.filter(
    (fileName) => fileName.endsWith(".html") && !fileName.includes("visadb-")
  );

  var themes = templates.map((fileName) => {
    return fileName.replace(".html", "");
  });

  setHeader(res, { ...headers, "Cache-Control": "no-cache" });

  if (supportedTypes.includes(type)) {
    res.redirect(
      `/api/generate/${type}/${
        themes[Math.floor(Math.random() * themes.length)]
      }?${options}`,
      307
    );
  } else {
    res.status(404).json({
      message: `Type not found, Only supports ${supportedTypes.join(", ")}`,
    });
  }
};
