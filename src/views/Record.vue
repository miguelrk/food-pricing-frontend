<template>
  <div class="app-view">
    <h1>Record</h1>
    <item-list></item-list>
  </div>
</template>

<script>
import DatabaseMixin from "@/mixins/DatabaseMixin.vue";

export default {
  name: "Record",
  components: {
    ItemList: () => import("@/components/ItemList.vue")
  },
  mixins: [DatabaseMixin],
  watch: {
    data(newVal) {
      console.log(newVal);
    }
  },
  mounted() {
    console.log(
      `https://thingproxy.freeboard.io/fetch/http://${this.$store.state.ipAddress}/prediction`
    );
  }
};
</script>
