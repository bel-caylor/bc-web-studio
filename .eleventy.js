const esbuild = require("esbuild");
const repoName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split("/")[1] : "";
const isUserSite = repoName && repoName.toLowerCase().endsWith(".github.io");
const pathPrefix = repoName && !isUserSite ? `/${repoName}` : "/";

function bundleClientJs() {
  esbuild.buildSync({
    entryPoints: ["src/js/main.js"],
    bundle: true,
    outdir: "dist/js",
    format: "esm",
    target: "es2017",
    sourcemap: true
  });
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("year", () => {
    return new Date().getFullYear();
  });
  eleventyConfig.addFilter("find", (arr, attr, value) =>
    arr.find(item => item[attr] === value)
  );
  eleventyConfig.addFilter("formatProjectDate", (value) => {
    if (!value) {
      return "";
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  });
  eleventyConfig.addFilter("caseStudyHighlights", (projects = [], clientType = "", limit = 3) => {
    if (!Array.isArray(projects)) {
      return [];
    }
    const toDateValue = (value) => {
      if (!value) return 0;
      const isoValue = /^\d{4}-\d{2}$/.test(value) ? `${value}-01` : value;
      const timestamp = Date.parse(isoValue);
      return Number.isNaN(timestamp) ? 0 : timestamp;
    };
    return projects
      .filter(project => {
        const types = Array.isArray(project.clientType)
          ? project.clientType
          : project.clientType
            ? [project.clientType]
            : [];
        return clientType ? types.includes(clientType) : true;
      })
      .sort((a, b) => toDateValue(b.endDate) - toDateValue(a.endDate))
      .slice(0, limit);
  });

  eleventyConfig.addWatchTarget("src/js");
  eleventyConfig.addWatchTarget("src/style.css");
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });

  eleventyConfig.addWatchTarget("dist/style.css");
  eleventyConfig.addWatchTarget("dist/js");
  eleventyConfig.setBrowserSyncConfig({
    open: true,
    files: ["dist/style.css", "dist/js/**/*.js"], 
  });

  if (process.env.ELEVENTY_SKIP_BUNDLE !== "1") {
    eleventyConfig.on("beforeBuild", bundleClientJs);
  }

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "dist"
    },
    pathPrefix
  };
};
