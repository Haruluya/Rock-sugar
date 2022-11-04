import nano_menu from "./src/nano_menu";

nano_menu.install = function(Vue) {
  Vue.component(nano_menu.name, nano_menu);
};

export default nano_menu;
