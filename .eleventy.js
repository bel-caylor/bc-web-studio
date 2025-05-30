module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("year", () => {
    return new Date().getFullYear();
  });
  eleventyConfig.addFilter("find", (arr, attr, value) =>
    arr.find(item => item[attr] === value)
  );

  eleventyConfig.addPassthroughCopy({ "./src/style.css": "style.css" });
  eleventyConfig.addWatchTarget("src/style.css");
  eleventyConfig.addPassthroughCopy({ "src/img/logos": "img/logos" });
  eleventyConfig.addPassthroughCopy({ "src/img/screenshots": "img/screenshots" });
  eleventyConfig.addPassthroughCopy("src/js");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "dist"
    }
  };
};
