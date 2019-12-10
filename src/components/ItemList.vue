<template>
  <v-data-table
    :headers="headers"
    :items="items"
    hide-default-footer
    dense
    item-key="id"
    group-by="purchaseId"
    class="elevation-1"
  >
    <!-- <template #group.header="props">
      <td colspan="6" class="text-start">
        <button
          type="button"
          class="ma-0 v-btn v-btn--flat v-btn--icon v-btn--round theme--light v-size--small"
        >
          <span class="v-btn__content">
            <i aria-hidden="true" class="v-icon notranslate mdi mdi-minus theme--light"></i>
          </span>
        </button>
        {{props.group}}
      </td>
    </template>-->

    <template #items="props">
      <tr>
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.calories }}</td>
        <td>{{ props.item.fat }}</td>
        <td>{{ props.item.carbs }}</td>
        <td>{{ props.item.protein }}</td>
        <td>{{ props.item.iron }}</td>
      </tr>
    </template>
  </v-data-table>
</template>


<script>
export default {
  name: "ItemList",
  data() {
    return {
      headers: [
        {
          text: "Dessert (100g serving)",
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: "Calories", value: "calories" },
        { text: "Fat (g)", value: "fat" },
        { text: "Carbs (g)", value: "carbs" },
        { text: "Protein (g)", value: "protein" },
        { text: "Iron (%)", value: "iron" }
      ],
      items: [
        {
          value: false,
          name: "Orange Juice",
          id: "000",
          purchaseId: "001",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: "7%"
        },
        {
          value: false,
          name: "Larabar",
          id: "001",
          purchaseId: "001",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: "45%"
        },
        {
          value: false,
          name: "Donut",
          id: "002",
          purchaseId: "001",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: "22%"
        },

        {
          value: false,
          name: "Bagel",
          id: "003",
          purchaseId: "002",
          calories: 999,
          fat: 28.0,
          carbs: 151,
          protein: 2.9,
          iron: "29%"
        },
        {
          value: false,
          name: "KitKat",
          id: "004",
          purchaseId: "002",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: "6%"
        },
        {
          value: false,
          name: "Orange Juice",
          id: "005",
          purchaseId: "002",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: "7%"
        },
        {
          value: false,
          name: "Larabar",
          id: "006",
          purchaseId: "003",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: "45%"
        },
        {
          value: false,
          name: "Donut",
          id: "007",
          purchaseId: "004",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: "22%"
        },

        {
          value: false,
          name: "Bagel",
          id: "008",
          purchaseId: "004",
          calories: 999,
          fat: 28.0,
          carbs: 151,
          protein: 2.9,
          iron: "29%"
        },
        {
          value: false,
          name: "KitKat",
          id: "009",
          purchaseId: "005",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: "6%"
        }
      ]
    };
  }
};
</script>
