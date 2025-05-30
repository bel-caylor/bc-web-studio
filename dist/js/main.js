console.log("[main.js] loaded");

function carousel({ images = [], interval = 3000 }) {
    console.log("[carousel] init with images:", images, "and interval:", interval);
  return {
    images,
    current: 0,
    timer: null,
    start() {
      this.stop();
      this.timer = setInterval(() => {
        this.current = (this.current + 1) % this.images.length;
      }, interval);
    },
    stop() {
      clearInterval(this.timer);
    }
  };
}

document.addEventListener("alpine:init", () => {
  Alpine.data("carousel", carousel);
  Alpine.start();
});
