import qs from "https://cdn.skypack.dev/qs";

const base = "/"; // for development with live-server use https://dynamic-image.vercel.app and a no-cors extension

document.addEventListener("DOMContentLoaded", async function () {
  // render themes
  var allThemeOptions = ``;
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
  let selectedTheme = getThemesFromServer[0].value;
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
  } catch (hasherr) {
    console.log(`Failed to parse the hash`);
  }

  generate();

  document.getElementById(
    "iframe"
  ).src = `${base}api/generate/html/${selectedTheme}`;
});

document.getElementById("generate").addEventListener("click", function (e) {
  e.target.innerText = "Generating...";
  setTimeout(() => {
    e.target.innerText = "Generate";
  }, 700);

  var urls = generate();

  document.getElementById("html").href = urls.html;
  document.getElementById("svg").href = urls.svg;
  document.getElementById("png").href = urls.png;

  document.getElementById("iframe").src = urls.html;
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

  return {
    html: `${base}api/generate/html/${theme}?${options}`,
    svg: `${base}api/generate/svg/${theme}?${options}`,
    png: `${base}api/generate/png/${theme}?${options}`,
  };
}
