import nano_canvas from "./src/nano_canvas";

nano_canvas.install = function(Vue) {
  Vue.component(nano_canvas.name, nano_canvas);
};

export default nano_canvas;
