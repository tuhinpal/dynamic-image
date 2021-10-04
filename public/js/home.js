import qs from "https://cdn.skypack.dev/qs";

const base = "/"; // for development with live-server use https://dynamic-image.vercel.app and a no-cors extension

document.addEventListener("DOMContentLoaded", async function () {
  // render themes
  var allThemeOptions = `<option value="random">Random</option>`;
  try {
    var getThemesFromServer = await (
      await fetch(`${base}api/other/get-theme`)
    ).json();
    getThemesFromServer.forEach((theme) => {
      allThemeOptions += `<option value="${theme.value}">${theme.name}</option>`;
    });
    document.getElementById("theme").innerHTML = allThemeOptions;
  } catch (error) {
    alert(`Failed to get the theme ${error.toString()}`);
  }

  // get the hased data and render it
  let selectedTheme = "random";
  let options = "";
  try {
    var hash = window.location.hash.replace("#", "");
    var prev_data = JSON.parse(atob(hash));

    if (prev_data.icon) document.getElementById("icon").value = prev_data.icon;
    if (prev_data.title)
      document.getElementById("title").value = prev_data.title;
    if (prev_data.content)
      document.getElementById("content").value = prev_data.content;
    if (prev_data.theme) {
      document.getElementById("theme").value = prev_data.theme;
      selectedTheme = prev_data.theme;
    }
    options = qs.stringify({ ...prev_data });
  } catch (hasherr) {
    console.log(`Failed to parse the hash`);
  }

  generate();

  // Initilize the iframe src
  document.getElementById("iframe").src =
    selectedTheme === "random"
      ? `${base}api/random/html?${options}`
      : `${base}api/generate/html/${selectedTheme}?${options}`;
});

document.getElementById("generate").addEventListener("click", function (e) {
  e.target.innerText = "Generating...";
  setTimeout(() => {
    e.target.innerText = "Generate";
  }, 700);

  generate();
});

function generate() {
  let theme = document.getElementById("theme").value;
  if (!theme || theme === "") theme = "yellowish-yellow";

  let data = {
    icon: document.getElementById("icon").value,
    title: document.getElementById("title").value,
    content: document.getElementById("content").value,
  };

  if (!data.icon || data.icon === "") delete data.icon;
  if (!data.title || data.title === "") delete data.title;
  if (!data.content || data.content === "") delete data.content;

  var options = qs.stringify({ ...data, ref: "website" });

  try {
    window.location.hash = btoa(JSON.stringify({ ...data, theme }));
  } catch (hasherr) {
    console.log(hasherr);
  }

  var urls = {};

  if (theme === "random") {
    urls.html = `${base}api/random/html?${options}`;
    urls.svg = `${base}api/random/svg?${options}`;
    urls.png = `${base}api/random/png?${options}`;
  } else {
    urls.html = `${base}api/generate/html/${theme}.html?${options}`;
    urls.svg = `${base}api/generate/svg/${theme}.svg?${options}`;
    urls.png = `${base}api/generate/png/${theme}.png?${options}`;
  }

  document.getElementById("html").href = urls.html;
  document.getElementById("svg").href = urls.svg;
  document.getElementById("png").href = urls.png;
  document.getElementById("iframe").src = urls.html;
  return urls;
}
