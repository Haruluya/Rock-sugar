import nano_param_slider from "./src/nano_param_slider";

nano_param_slider.install = function(Vue) {
  Vue.component(nano_param_slider.name, nano_param_slider);
};

export default nano_param_slider;
