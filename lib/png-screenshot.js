const puppPage = require("./pupp-page");

module.exports = async function (document) {
  const page = await puppPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setContent(document);
  const file = await page.screenshot();
  return file;
};
