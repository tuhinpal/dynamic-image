const core = require("puppeteer-core");
const getOptions = require("./get-options");
const isDev = process.env.NODE_ENV === "development";

module.exports = async function () {
  if (page) {
    return page;
  }
  const options = await getOptions(isDev);
  const browser = await core.launch(options);
  var page = await browser.newPage();
  return page;
};
