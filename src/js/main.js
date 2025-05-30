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
});
