const axios = require("axios");

module.exports = async function ({
  options,
  req,
  duration_ms,
  res_size_bytes,
}) {
  if (process.env.AXIOM_KEY) {
    try {
      if (!req.query.name || !req.query.type)
        throw new Error("Missing name or type");

      await axios({
        method: "post",
        url: "https://cloud.axiom.co/api/v1/datasets/logs/ingest",
        headers: {
          Authorization: `Bearer ${process.env.AXIOM_KEY}`,
          "Content-Type": "application/x-ndjson",
        },
        data: JSON.stringify({
          path: req.url,
          method: "GET",
          duration_ms: duration_ms || 0,
          res_size_bytes: res_size_bytes || 0,
          data_template_name: req.query.name.replace(`.${req.query.type}`, ""),
          data_template_type: req.query.type,
          data: {
            ...options,
          },
        }),
      });
    } catch (error) {
      console.log(`Logger error: ${error?.message}`);
    }
  } else {
    console.log("Project configuration is not using a logger");
  }
};
