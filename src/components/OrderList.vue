<template>
  <v-data-table
    :headers="headers"
    :items="orders"
    hide-default-footer
    dense
    item-key="id"
    group-by="orderID"
    class="elevation-1"
  >
    <template #items="props">
      <tr>
        <td>{{ Date(props.item.created).slice(4, 15) }}</td>
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.class }}</td>
        <td>{{ props.item.weight }}</td>
        <td>{{ props.item.price }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import { mapState } from "vuex";
import DatabaseMixin from "@/mixins/DatabaseMixin.vue";

export default {
  name: "OrderList",
  mixins: [DatabaseMixin],
  data() {
    return {
      headers: [
        { text: "Created", align: "left", sortable: false, value: "created" },
        { text: "ID", align: "left", sortable: false, value: "id" },
        { text: "Class", align: "left", sortable: false, value: "class" },
        { text: "Weight (g)", align: "left", sortable: false, value: "weigth" },
        { text: "Price (EUR)", align: "left", sortable: false, value: "price" }
      ]
    };
  },
  computed: {
    ...mapState({
      notifications: state => state.notifications,
      menuItems: state => state.menuItems,
      itemsInCurrentOrder: state => state.itemsInCurrentOrder
    })
  }
};
</script>
