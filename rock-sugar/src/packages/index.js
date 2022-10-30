import nano_button from "./nano_button";
import nano_menu from "./nano_menu";
import nano_slider from "./nano_slider";
import nano_items_menu from "./nano_items_menu";
import nano_link_card from "./nano_link_card";
import nano_footer from "./nano_footer";
import nano_webgl_des_panel from "./nano_webgl_des_panel";
import nano_canvas from "./nano_canvas";
import nano_effect_bg_starry from "./nano_effect_bg_starry";
import nano_process_button_line from "./nano_process_button_line";
import nano_totop_button from "./nano_totop_button";


const components = [
    nano_button,nano_menu,nano_slider,nano_items_menu,
    nano_link_card,nano_footer,nano_canvas,nano_webgl_des_panel,
    nano_effect_bg_starry,nano_process_button_line,
    nano_totop_button
];

const nano_install = function(Vue) {
  components.map((component) => Vue.component(component.name, component));
};

if (typeof window !== "undefined" && window.Vue) {
    nano_install(window.Vue);
}

export {
    nano_install,
    nano_button,
    nano_menu,
    nano_slider,
    nano_items_menu,
    nano_link_card,
    nano_footer,
    nano_webgl_des_panel,
    nano_canvas,
    nano_effect_bg_starry,
    nano_process_button_line,
    nano_totop_button
};

export default {
    nano_install,
    nano_button,
    nano_menu,
    nano_slider,
    nano_items_menu,
    nano_link_card,
    nano_footer,
    nano_webgl_des_panel,
    nano_canvas,
    nano_effect_bg_starry,
    nano_process_button_line,
    nano_totop_button

};
