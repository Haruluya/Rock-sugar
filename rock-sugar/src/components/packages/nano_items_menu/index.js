import nano_items_menu from "./src/nano_items_menu";

nano_items_menu.install = function(Vue) {
  Vue.component( nano_items_menu.name,  nano_items_menu);
};

export default  nano_items_menu;
