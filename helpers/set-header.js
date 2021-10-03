module.exports = {
  setHeader: function (res, headers) {
    Object.keys(headers).forEach((key) => {
      res.setHeader(key, headers[key]);
    });
    return;
  },
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Cache-Control":
      "public, immutable, no-transform, s-maxage=2592000, max-age=2592000",
  },
};
