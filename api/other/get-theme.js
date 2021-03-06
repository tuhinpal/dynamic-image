const { readdirSync } = require("fs");
const { join } = require("path");

module.exports = function (req, res) {
  var getDir = readdirSync(join(__dirname, "..", "..", "template"));
  var templates = getDir.filter(
    (fileName) => fileName.endsWith(".html") && !fileName.includes("visadb-")
  );

  var themes = templates.map((fileName) => {
    let value = fileName.replace(".html", "");
    return {
      name: value
        .toLowerCase()
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      value,
    };
  });

  res.setHeader(
    "cache-control",
    "public, immutable, no-transform, max-age=86400"
  );

  res.status(200).json(themes);
};
