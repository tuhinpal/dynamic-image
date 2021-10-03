module.exports = function (template, data) {
  var result = template;

  if (template.includes("SSR[")) {
    return SSR(
      template,
      template.split("SSR[")[1].split("]")[0].split("~"),
      data
    );
  } else {
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
      let key = keys[i];
      result = result.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
    }
    return result;
  }
};

// SVG are not picking the changes in the DOM So have to do that here
// Add this after head <!-- SSR[last|first~content~color: #ffed75;] -->
// ARG[0]: Method, ARG[1]: Key, ARG[2]: Style

function SSR(template, args, data) {
  var result = template;
  var argKey = args[1];

  switch (args[0]) {
    case "last": {
      let words = data[argKey].split(" ");
      let last = words.pop();
      result = result.replace(
        new RegExp(`{{${argKey}}}`, "g"),
        `${words.join(" ")} <span style="${args[2]}">${last}</span>`
      );
    }
    case "first": {
      let words = data[argKey].split(" ");
      let first = words.shift();
      result = result.replace(
        new RegExp(`{{${argKey}}}`, "g"),
        `<span style="${args[2]}">${first}</span> ${words.join(" ")}`
      );
    }
  }

  var keys = Object.keys(data).filter((key) => key !== argKey);
  for (var i = 0; i < keys.length; i++) {
    let key = keys[i];
    result = result.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
  }
  return result;
}
