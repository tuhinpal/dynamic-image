module.exports = function (template, data) {
  var result = template;
  var keys = Object.keys(data);
  for (var key in keys) {
    result = result.replace(new RegExp("{{" + key + "}}", "g"), data[key]);
  }
  return result;
};
