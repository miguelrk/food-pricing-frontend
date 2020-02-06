<template>
  <div class="app-view">
    <h1 class="hidden-md-and-down">Orders</h1>
    <orders-list></orders-list>
  </div>
</template>

<script>
import { mapState } from "vuex";
import DatabaseMixin from "@/mixins/DatabaseMixin.vue";

export default {
  name: "Orders",
  components: {
    OrdersList: () => import("@/components/OrdersList.vue")
  },
  mixins: [DatabaseMixin],
  computed: {
    ...mapState({
      notifications: state => state.notifications,
      menuItems: state => state.menuItems,
      itemsInCurrentOrder: state => state.itemsInCurrentOrder
    })
  },
  watch: {
    data(newVal) {
      console.log(newVal);
    }
  }
};
</script>
