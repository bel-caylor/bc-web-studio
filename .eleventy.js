const { execFileSync } = require("child_process");
const esbuildCli = require.resolve("esbuild/bin/esbuild");
const esbuildArgs = [
  "src/js/main.js",
  "--bundle",
  "--outdir=dist/js",
  "--format=esm",
  "--target=es2017",
  "--sourcemap"
];

function bundleClientJs() {
  execFileSync(process.execPath, [esbuildCli, ...esbuildArgs], { stdio: "inherit" });
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("year", () => {
    return new Date().getFullYear();
  });
  eleventyConfig.addFilter("find", (arr, attr, value) =>
    arr.find(item => item[attr] === value)
  );

  eleventyConfig.addWatchTarget("src/js");
  eleventyConfig.addWatchTarget("src/style.css");
  eleventyConfig.addPassthroughCopy({ "src/img/logos": "img/logos" });
  eleventyConfig.addPassthroughCopy({ "src/img/screenshots": "img/screenshots" });
  eleventyConfig.addPassthroughCopy({ "src/img/hero-bg.png": "img/hero-bg.png" });

  eleventyConfig.addWatchTarget("dist/style.css");
  eleventyConfig.addWatchTarget("dist/js");
  eleventyConfig.setBrowserSyncConfig({
    open: true,
    files: ["dist/style.css", "dist/js/**/*.js"], 
  });

  eleventyConfig.on("beforeBuild", bundleClientJs);

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "dist"
    }
  };
};
