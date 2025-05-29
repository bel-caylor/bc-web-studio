module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("year", () => {
    return new Date().getFullYear();
  });
  eleventyConfig.addFilter("find", (arr, attr, value) =>
    arr.find(item => item[attr] === value)
  );
  

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "dist"
    }
  };
};
