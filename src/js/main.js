document.addEventListener("alpine:init", () => {
  console.log("[main.js] alpine:init");
  Alpine.data('projectCarousel', (project) => ({
    images: Array.isArray(project.screenshots)
              ? project.screenshots
              : project.screenshots
                ? [project.screenshots]
                : [],
    interval: project.interval ?? 3000,
    current: 0,
    timer: null,
    init() {
      this.start();
    },
    start() {
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
  }));
  Alpine.data('projectExplorer', ({ projects, filters }) => {
    const normalizedProjects = projects.map(project => {
      const clientTypeList = Array.isArray(project.clientType)
        ? project.clientType
        : project.clientType
          ? [project.clientType]
          : [];
      return {
        ...project,
        clientType: clientTypeList,
        primaryClientTypeId: clientTypeList[0] ?? null
      };
    });

    return {
      projects: normalizedProjects,
      allFilters: filters,
      panelFilters: [],
      heroFilters: [],
      selections: {},
      init() {
        this.panelFilters = this.allFilters.filter(f => f.placement !== "hero");
        this.heroFilters = this.allFilters.filter(f => f.placement === "hero");
        this.allFilters.forEach(filter => {
          this.selections[filter.id] = 'all';
        });
        this.applyQueryParams();
      },
      toggle(filterId, optionId) {
        this.selections[filterId] =
          this.selections[filterId] === optionId ? 'all' : optionId;
      },
      clear(filterId) {
        if (Object.prototype.hasOwnProperty.call(this.selections, filterId)) {
          this.selections[filterId] = 'all';
        }
      },
      resetAll() {
        Object.keys(this.selections).forEach(key => {
          this.selections[key] = 'all';
        });
      },
      applyQueryParams() {
        if (typeof window === "undefined") {
          return;
        }
        const params = new URLSearchParams(window.location.search);
        this.allFilters.forEach(filter => {
          const paramValue = params.get(filter.id) ?? params.get(filter.field);
          if (paramValue && this.isOptionValid(filter, paramValue)) {
            this.selections[filter.id] = paramValue;
          }
        });
      },
      isOptionValid(filter, value) {
        return filter.options?.some(opt => opt.id === value);
      },
      hasSelection(filterId) {
        return this.selections[filterId] && this.selections[filterId] !== 'all';
      },
      hasActiveFilters() {
        return Object.values(this.selections).some(value => value && value !== 'all');
      },
      isActive(filterId, optionId) {
        return this.selections[filterId] === optionId;
      },
      optionLabel(filterId, optionId) {
        const filter = this.allFilters.find(f => f.id === filterId);
        if (!filter) return optionId;
        const option = filter.options.find(opt => opt.id === optionId);
        return option ? option.label : optionId;
      },
      primaryClientType(project) {
        const segment = project.primaryClientTypeId ?? (Array.isArray(project.clientType) ? project.clientType[0] : project.clientType);
        return segment ? this.optionLabel('clientType', segment) : '';
      },
      formatDate(value) {
        if (!value) return '';
        const date = new Date(value);
        if (isNaN(date.getTime())) return value;
        return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      },
      activeFilterSummary() {
        const parts = [];
        this.allFilters.forEach(filter => {
          const selection = this.selections[filter.id];
          if (selection && selection !== 'all') {
            parts.push(`${filter.label}: ${this.optionLabel(filter.id, selection)}`);
          }
        });
        return parts.join(', ');
      },
      get filteredProjects() {
        return this.projects.filter(project => this.projectMatches(project));
      },
      handleHeroSelection(filterId, optionId) {
        this.toggle(filterId, optionId);
        if (this.selections[filterId] !== 'all') {
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
        const combined = { ...this.selections, ...overrides };
        return this.allFilters.every(filter => {
          const selection = combined[filter.id];
          if (!selection || selection === 'all') {
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
        return this.projects.some(project =>
          this.projectMatches(project, { [filterId]: optionId })
        );
      }
    };
  });
});
