/* eslint-disable prettier/prettier */
<template>
  <v-list two-line class="pa-0">
    <v-toolbar transparent flat>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="Boolean(selected.length)">
        <v-btn text icon @click.stop="deleteItems(selected)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <template v-if="orders.length">
      <template v-for="(order, i) in orders">
        <v-list-item v-if="i === 0" class="app-list-row" :key="`v-list-item-header-${i}`">
          <v-row justify="space-between" align="center">
            <v-col class="text-left title mr-5 pr-5 hidden-sm-and-down">Timestamp</v-col>
            <v-col class="text-right title mr-5 pr-5 hidden-sm-and-down">ID</v-col>
            <v-col class="text-right title mr-5 pr-5 hidden-sm-and-down">Total Price</v-col>
          </v-row>
        </v-list-item>

        <v-list-item
          class="app-list-row"
          :class="{
            'app-list-row__selected': isSelected(order.id),
            'app-list-row__active': $route.params.id === order.id
          }"
          :key="`v-list-item-${i}`"
          @click.stop="openDetails(order)"
        >
          <v-row justify="space-between" align="center">
            <v-col>
              <span class="font-weight-bold">{{ order.class }}</span>
              <v-list-item-subtitle>{{ Date(order.created).substr(0, 21) }}</v-list-item-subtitle>
            </v-col>
            <v-col class="text-right mr-5 pr-5 hidden-sm-and-down">{{ order.id }} g</v-col>
            <v-col class="text-right mr-5 pr-5">{{order.price}}</v-col>
          </v-row>

          <!-- <v-list-item-action class="app-list-actions justify-center">
            <v-row>
              <v-btn text icon @click.stop="deleteItem(order)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-row>
          </v-list-item-action>-->
        </v-list-item>
        <v-divider :key="`v-divider-${i}`"></v-divider>
      </template>
    </template>

    <!-- NO-DATA PLACEHOLDER CONTENT -->
    <template v-else-if="itemsInCurrentOrder.length === 0">
      <v-row class="fill-height" column justify="center" align="center">
        <v-icon size="64px">mdi-food</v-icon>
        <v-subheader class="mt-2 text-center">
          No food items yet.
          <br />Place food item below the camera.
        </v-subheader>
      </v-row>
    </template>

    <!-- ERROR PLACEHOLDER CONTENT -->
    <template v-else-if="items === null">
      <v-row class="fill-height" justify="center" align="center">
        <v-icon size="64px">mdi-error</v-icon>
        <v-subheader class="mt-2 text-center">
          Error fetching data.
          <br />Try checking your internet connection.
        </v-subheader>
      </v-row>
    </template>

    <!-- DIALOG TO CONFIRM DELETE -->
    <v-dialog v-model="detailsDialog" :max-width="1250">
      <v-card>
        <v-card-title class="headline">
          Order details
          <v-spacer></v-spacer>
          <v-btn icon text @click="closeDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text v-if="detailsDialog">
          <items-list :order="selectedOrder"></items-list>
        </v-card-text>
        <!-- <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="detailsDialog = false">Cancel</v-btn>
          <v-btn color="error" text @click="deleteItems(selected)">Delete</v-btn>
        </v-card-actions>-->
      </v-card>
    </v-dialog>
  </v-list>
</template>

<script>
import { mapState } from "vuex";
import DatabaseMixin from "@/mixins/DatabaseMixin.vue";
// import { storage } from "@/firebase.js";

export default {
  name: "OrdersList",
  components: {
    ItemsList: () => import("@/components/ItemsList.vue")
  },
  mixins: [DatabaseMixin],
  data() {
    return {
      selected: [],
      descending: false,
      sortBy: "class",
      headers: [
        { text: "Timestamp", align: "left", sortable: true, value: "created" },
        { text: "ID", align: "left", sortable: true, value: "id" },
        { text: "Total Price", align: "left", sortable: true, value: "price" }
      ],
      detailsDialog: false,
      selectedOrder: null
    };
  },
  computed: {
    ...mapState({
      notifications: state => state.notifications,
      menuItems: state => state.menuItems
    }),
    itemsInCurrentOrder: {
      get() {
        return this.$store.state.itemsInCurrentOrder;
      },
      set(value) {
        this.$store.commit("SET", {
          prop: "itemsInCurrentOrder",
          value: value
        });
      }
    },
    items() {
      return this.predictions;
    },
    collectionRef() {
      return this.$firestoreRefs.predictions;
    }
  },
  methods: {
    // getImageURL(filename) {
    //   //   console.log(filename);
    //   // Create a reference with an initial file path and name
    //   const imageRef = this.getImageRefByFilename(filename);
    //   console.log(imageRef);
    //   const url = this.getURLfromRef(imageRef);
    //   //   console.log(url);
    //   return url;
    // },
    // getImageRefByFilename(filename) {
    //   const folderRef = storage.ref(`/predictions`);
    //   folderRef.listAll().then(res => {
    //     return res.find(itemRef => {
    //       console.log(itemRef.name);
    //       return itemRef.name.includes(filename);
    //     });
    //   });
    // },
    getURLfromRef(ref) {
      ref
        .getDownloadURL()
        .then(url => {
          return url;
        })
        .catch(error => {
          console.error(error);
        });
    },
    isSelected(id) {
      return this.selected.find(d => d.id === id);
    },
    addOrRemove(item) {
      var index = this.selected.indexOf(item);
      if (index === -1) {
        this.selected.push(item);
      } else {
        this.selected.splice(index, 1);
      }
    },
    cloneItems(selected) {
      selected.forEach(async item => {
        let clone = { ...item }; // clones item instead of creating reference
        clone.id = this.getUID();
        this.cloneItem(clone);
      });
      this.selected = [];
    },
    cloneItem(clone) {
      this.$store.commit("ADD", {
        prop: "itemsInCurrentOrder",
        value: clone
      });
    },
    deleteItems(selected) {
      selected.forEach(item => this.deleteItem(item));
    },
    deleteItem(item) {
      console.log(item);
      this.deleteDocById(this.$firestoreRefs.orders, item.id);
      this.detailsDialog = false;
      this.selected = [];
    },
    openDialog(type, data = null) {
      this.$store.commit("OPEN_DIALOG", { type: type, data: data });
    },
    closeDialog() {
      this.detailsDialog = false;
      this.selectedOrder = null;
    },
    getUID() {
      return (
        "_" +
        Math.random()
          .toString(36)
          .substr(2, 9)
      );
    },
    openDetails(order) {
      console.log(order);
      this.selectedOrder = order;
      this.detailsDialog = true;
    }
  }
};
</script>

<style scoped>
.app-list-row {
  padding-left: 32px !important;
  padding-right: 32px !important;
}
.app-list-row__selected {
  /* selected row: */
  background-color: rgb(0, 0, 0, 0.05); /* shade row if selected */
}

.list-avatar:hover {
  cursor: pointer;
}
.list-avatar__selected {
  border: 5px solid #cccccc !important;
}
.app-list-row .app-list-actions .v-icon {
  opacity: 0.25 !important;
}
.app-list-row:hover .app-list-actions .v-icon {
  opacity: 0.9 !important;
}
</style>
