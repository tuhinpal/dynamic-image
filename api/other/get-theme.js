const { readdirSync } = require("fs");
const { join } = require("path");

module.exports = function (req, res) {
  var getDir = readdirSync(join(__dirname, "..", "..", "template"));
  var templates = getDir.filter((fileName) => fileName.endsWith(".html"));

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

  res.status(200).json(themes);
};
