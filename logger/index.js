const axios = require("axios");

module.exports = async function ({
  options,
  req,
  duration_ms,
  res_size_bytes,
}) {
  if (process.env.AXIOM_KEY) {
    try {
      let injected_data = {};

      Object.keys(options).forEach((key) => {
        if (["title", "content", "icon"].includes(key)) {
          injected_data[`data_${key}`] = req.query[key];
        }
      });

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
          data_query: {
            ...req.query,
          },
          data_template_name: req.query.name.replace(`.${req.query.type}`, ""),
          data_template_type: req.query.type,
          ...injected_data,
        }),
      });
    } catch (error) {
      console.log(`Logger error: ${error?.message}`);
    }
  } else {
    console.log("Project configuration is not using a logger");
  }
};
