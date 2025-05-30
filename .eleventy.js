module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("year", () => {
    return new Date().getFullYear();
  });
  eleventyConfig.addFilter("find", (arr, attr, value) =>
    arr.find(item => item[attr] === value)
  );

  eleventyConfig.addWatchTarget("src/style.css");
  eleventyConfig.addPassthroughCopy({ "src/img/logos": "img/logos" });
  eleventyConfig.addPassthroughCopy({ "src/img/screenshots": "img/screenshots" });
  eleventyConfig.addPassthroughCopy("src/js");

  eleventyConfig.addWatchTarget("dist/style.css");
  eleventyConfig.setBrowserSyncConfig({
    open: true,
    files: ["dist/style.css"], 
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "dist"
    }
  };
};
