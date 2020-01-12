import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

// ["#7DB3FF", "#49457B", "#FF7C78", "#FED3D0", "#6F76D9", "#9ADFB4", "#2E7987"];

let colors = {
  primary: "#0080FF",
  secondary: "#18ECC0",
  accent: "#5c4ae4",
  background: "#F5F5F5",
  error: "#F04722",
  info: "#51A0FB",
  infoDark: "#1867C0",
  success: "#44C47D",
  warning: "#FFC107"
};

export default new Vuetify({
  theme: {
    themes: {
      light: colors,
      dark: colors
    }
  },
  //   icons: {
  //     iconfont: "md" // default is 'mdi'
  //   },
  options: {
    customProperties: true // generate a css variable for each theme color
  }
});
