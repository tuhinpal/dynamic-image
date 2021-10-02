module.exports = function (document) {
  return document.replace(
    "</body>",
    `<script type="module">
      import {documentToSVG, inlineResources} from 'https://cdn.skypack.dev/dom-to-svg';
      async function getSvg() {
  const svgDocument = documentToSVG(document)
  await inlineResources(svgDocument.documentElement)
  const svgString = new XMLSerializer().serializeToString(svgDocument)
  console.log(svgString)
    }
    getSvg()
</script>
</body>`
  );
};

// Thanks to dom-to-svg (https://github.com/felixfbecker/dom-to-svg) !
// Thanks to skypack for cdn !
