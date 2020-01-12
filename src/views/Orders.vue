<template>
  <div class="app-view">
    <h1>Orders</h1>
    <order-list></order-list>
  </div>
</template>

<script>
import { mapState } from "vuex";
import DatabaseMixin from "@/mixins/DatabaseMixin.vue";

export default {
  name: "Orders",
  components: {
    OrderList: () => import("@/components/OrderList.vue")
  },
  mixins: [DatabaseMixin],
  computed: {
    ...mapState({
      notifications: state => state.notifications,
      proxyHost: state => state.notifications,
      deviceHost: state => state.deviceHost,
      menuItems: state => state.menuItems,
      itemsInCurrentOrder: state => state.itemsInCurrentOrder
    })
  },
  watch: {
    data(newVal) {
      console.log(newVal);
    }
  }
  // mounted() {
  //   console.log(
  //     `${this.proxyHost}http://${this.$store.state.ipAddress}/prediction`
  //   );
  // }
};
</script>
