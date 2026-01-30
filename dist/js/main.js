var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/js/main.js
document.addEventListener("alpine:init", () => {
  console.log("[main.js] alpine:init");
  Alpine.data("projectCarousel", (project) => {
    var _a;
    return {
      project,
      images: Array.isArray(project.screenshots) ? project.screenshots : project.screenshots ? [project.screenshots] : [],
      interval: (_a = project.interval) != null ? _a : 3e3,
      current: 0,
      timer: null,
      init() {
        if (this.images.length > 1) {
          this.start();
        }
      },
      start() {
        if (this.images.length <= 1) return;
        this.stop();
        this.timer = setInterval(() => {
          this.current = (this.current + 1) % this.images.length;
        }, this.interval);
      },
      stop() {
        clearInterval(this.timer);
      },
      goTo(i) {
        this.current = i;
      }
    };
  });
  Alpine.data("projectExplorer", ({ projects, filters }) => {
    const toDateValue = (value) => {
      if (!value) return 0;
      const isoValue = /^\d{4}-\d{2}$/.test(value) ? `${value}-01` : value;
      const timestamp = Date.parse(isoValue);
      return Number.isNaN(timestamp) ? 0 : timestamp;
    };
    const normalizedProjects = projects.map((project) => {
      var _a;
      const clientTypeList = Array.isArray(project.clientType) ? project.clientType : project.clientType ? [project.clientType] : [];
      return __spreadProps(__spreadValues({}, project), {
        clientType: clientTypeList,
        primaryClientTypeId: (_a = clientTypeList[0]) != null ? _a : null,
        endDateValue: toDateValue(project.endDate)
      });
    });
    return {
      projects: normalizedProjects,
      allFilters: filters,
      panelFilters: [],
      heroFilters: [],
      selections: {},
      filterMenuOpen: false,
      init() {
        this.panelFilters = this.allFilters.filter((f) => f.placement !== "hero");
        this.heroFilters = this.allFilters.filter((f) => f.placement === "hero");
        this.allFilters.forEach((filter) => {
          this.selections[filter.id] = "all";
        });
        this.applyQueryParams();
      },
      toggleFilterMenu() {
        this.filterMenuOpen = !this.filterMenuOpen;
      },
      closeFilterMenu() {
        this.filterMenuOpen = false;
      },
      toggle(filterId, optionId) {
        this.selections[filterId] = this.selections[filterId] === optionId ? "all" : optionId;
      },
      clear(filterId) {
        if (Object.prototype.hasOwnProperty.call(this.selections, filterId)) {
          this.selections[filterId] = "all";
        }
      },
      resetAll() {
        Object.keys(this.selections).forEach((key) => {
          this.selections[key] = "all";
        });
      },
      applyQueryParams() {
        if (typeof window === "undefined") {
          return;
        }
        const params = new URLSearchParams(window.location.search);
        this.allFilters.forEach((filter) => {
          var _a;
          const paramValue = (_a = params.get(filter.id)) != null ? _a : params.get(filter.field);
          if (paramValue && this.isOptionValid(filter, paramValue)) {
            this.selections[filter.id] = paramValue;
          }
        });
      },
      isOptionValid(filter, value) {
        var _a;
        return (_a = filter.options) == null ? void 0 : _a.some((opt) => opt.id === value);
      },
      hasSelection(filterId) {
        return this.selections[filterId] && this.selections[filterId] !== "all";
      },
      hasActiveFilters() {
        return Object.values(this.selections).some((value) => value && value !== "all");
      },
      isActive(filterId, optionId) {
        return this.selections[filterId] === optionId;
      },
      optionLabel(filterId, optionId) {
        const filter = this.allFilters.find((f) => f.id === filterId);
        if (!filter) return optionId;
        const option = filter.options.find((opt) => opt.id === optionId);
        return option ? option.label : optionId;
      },
      primaryClientType(project) {
        var _a;
        const segment = (_a = project.primaryClientTypeId) != null ? _a : Array.isArray(project.clientType) ? project.clientType[0] : project.clientType;
        return segment ? this.optionLabel("clientType", segment) : "";
      },
      formatDate(value) {
        if (!value) return "";
        const date = new Date(value);
        if (isNaN(date.getTime())) return value;
        return date.toLocaleString("en-US", { month: "long", year: "numeric" });
      },
      activeFilterSummary() {
        const parts = [];
        this.allFilters.forEach((filter) => {
          const selection = this.selections[filter.id];
          if (selection && selection !== "all") {
            parts.push(`${filter.label}: ${this.optionLabel(filter.id, selection)}`);
          }
        });
        return parts.join(", ");
      },
      panelSummary() {
        const parts = this.panelFilters.map((filter) => {
          const selection = this.selections[filter.id];
          if (selection && selection !== "all") {
            return `${filter.label}: ${this.optionLabel(filter.id, selection)}`;
          }
          return null;
        }).filter(Boolean);
        return parts.length ? parts.join(" | ") : "Scope + Platform available";
      },
      panelActiveCount() {
        return this.panelFilters.reduce((count, filter) => {
          const selection = this.selections[filter.id];
          return selection && selection !== "all" ? count + 1 : count;
        }, 0);
      },
      get filteredProjects() {
        return this.projects.filter((project) => this.projectMatches(project)).sort((a, b) => b.endDateValue - a.endDateValue);
      },
      handleHeroSelection(filterId, optionId) {
        this.toggle(filterId, optionId);
        if (this.selections[filterId] !== "all") {
          this.scrollToLibrary();
        }
      },
      scrollToLibrary() {
        if (typeof window === "undefined") {
          return;
        }
        const target = document.getElementById("case-study-library");
        if (target) {
          window.requestAnimationFrame(() => {
            const offset = 120;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({
              top: top < 0 ? 0 : top,
              behavior: "smooth"
            });
          });
        }
      },
      projectMatches(project, overrides = {}) {
        const combined = __spreadValues(__spreadValues({}, this.selections), overrides);
        return this.allFilters.every((filter) => {
          const selection = combined[filter.id];
          if (!selection || selection === "all") {
            return true;
          }
          const fieldValue = project[filter.field];
          if (Array.isArray(fieldValue)) {
            return fieldValue.includes(selection);
          }
          return fieldValue === selection;
        });
      },
      optionHasResults(filterId, optionId) {
        return this.projects.some(
          (project) => this.projectMatches(project, { [filterId]: optionId })
        );
      }
    };
  });
});
//# sourceMappingURL=main.js.map
