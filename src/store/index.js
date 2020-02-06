import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    notifications: [],
    itemsInCurrentOrder: [],
    menuItems: [
      {
        id: "1",
        class: "Bread",
        price: 0.89,
        imageURL:
          "https://previews.123rf.com/images/iofoto/iofoto0710/iofoto071002510/1906551-one-slice-of-toast-on-plate-.jpg"
      },
      {
        id: "2",
        class: "Dairy product",
        price: 0.89,
        imageURL:
          "https://media.gettyimages.com/photos/directly-above-view-of-berries-in-yoghurt-plate-on-table-picture-id593445071"
      },
      {
        id: "3",
        class: "Dessert",
        price: 0.89,
        imageURL:
          "https://assets3.thrillist.com/v1/image/1656852/size/tmg-article_default_mobile.jpg"
      },
      {
        id: "4",
        class: "Egg",
        price: 0.67,
        imageURL:
          "https://media.istockphoto.com/vectors/fried-egg-on-a-plate-vector-illustration-vector-id496774322"
      },
      {
        id: "5",
        class: "Fried food",
        price: 0.89,
        imageURL: "https://s3.envato.com/files/250840577/39618_.jpg"
      },
      {
        id: "6",
        class: "Meat",
        price: 1.92,
        imageURL:
          "http://images.utensilholder.org/l-m/sizzling-platter-steak-plate-set.jpg"
      },
      {
        id: "7",
        class: "Noodles/Pasta",
        price: 1.1,
        imageURL:
          "https://previews.123rf.com/images/nataliaspb/nataliaspb1301/nataliaspb130100045/17317603-spaghetti-bolognese-on-the-white-plate-on-white-background.jpg"
      },
      {
        id: "8",
        class: "Rice",
        price: 1.18,
        imageURL:
          "https://previews.123rf.com/images/sommai/sommai1501/sommai150100064/35054583-cooked-rice-in-a-white-plate-on-white-background.jpg"
      },
      {
        id: "9",
        class: "Seafood",
        price: 1.89,
        imageURL:
          "https://media.istockphoto.com/photos/plate-of-clams-picture-id656115542"
      },
      {
        id: "10",
        class: "Soup",
        price: 1.07,
        imageURL:
          "https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2013/05/recipe-image-legacy-id-1074500_11.jpg"
      },
      {
        id: "11",
        class: "Vegetable/Fruit",
        price: 1.9,
        imageURL:
          "https://previews.123rf.com/images/margouillat/margouillat1308/margouillat130800444/21698479-plate-of-vegetables.jpg"
      }
    ]
  },
  mutations: {
    SET(state, payload) {
      state[payload.prop] = payload.value;
    },
    TOGGLE(state, payload) {
      state[payload.prop] = !state[payload.prop];
    },
    ADD(state, payload) {
      state[payload.prop].push(payload.value);
    },
    FIRE_NOTIFICATION(state, payload) {
      state.notifications.push({
        text: payload.text,
        type: payload.type,
        options: {
          closeable: true,
          ...payload.options
        }
      });
    },
    CLEAR_NOTIFICATIONS(state) {
      state.notifications = [];
    }
  },
  actions: {},
  modules: {}
});
