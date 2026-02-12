document.addEventListener("DOMContentLoaded", function () {
  AOS.init({
    once: true,
    startEvent: "load",
  });

  const scenes = document.querySelectorAll(".scene"); // выбрать все элементы с классом "scene"
  scenes.forEach((scene) => {
    const parallaxInstance = new Parallax(scene);
  });
});
