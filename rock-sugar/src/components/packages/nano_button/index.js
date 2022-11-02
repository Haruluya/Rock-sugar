import nano_button from "./src/nano_button";

nano_button.install = function(Vue) {
  Vue.component(nano_button.name, nano_button);
};


export default nano_button;
