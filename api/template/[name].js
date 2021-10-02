const { readFileSync } = require("fs");
const { join } = require("path");
const templateEngine = require("../../lib/template-engine");

module.exports = async function (req, res) {
  const { name } = req.params;
  const { icon, brand, content } = req.query;
  try {
    var template = readFileSync(
      join(__dirname, "template", `${name}.html`),
      "utf-8"
    );
  } catch (error) {
    res.status(500).json({ message: "Template not found !" }).end();
  }

  var template = templateEngine(template, {
    icon: icon || "/public/icon/think.svg",
    brand: brand || "Company Inc.",
    content: content || "Open graph heading",
  });
  res.status(200).send(template);
};
