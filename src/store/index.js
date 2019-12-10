import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    iPAddress: ""
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
    }
  },
  actions: {},
  modules: {}
});
