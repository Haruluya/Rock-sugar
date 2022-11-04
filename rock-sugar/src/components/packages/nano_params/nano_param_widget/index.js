import nano_param_widget from "./src/nano_param_widget";

nano_param_widget.install = function(Vue) {
  Vue.component(nano_param_widget.name, nano_param_widget);
};

export default nano_param_widget;
