async function copy(elem) {
  var text = document.getElementById(elem).href;
  await navigator.clipboard.writeText(text);
  alert("Copied to clipboard");
}
