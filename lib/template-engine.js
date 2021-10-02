module.exports = function (template, data) {
  var result = template;
  var keys = Object.keys(data);
  for (var i = 0; i < keys.length; i++) {
    let key = keys[i];
    result = result.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
  }
  return result;
};
