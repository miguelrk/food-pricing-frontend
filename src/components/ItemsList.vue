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
    <template v-if="items.length">
      <template v-for="(item, i) in items">
        <v-list-item v-if="i === 0" class="app-list-row" :key="`v-list-item-header-${i}`">
          <v-row justify="space-between" align="center">
            <v-col class="text-left title mr-5 pr-5 hidden-sm-and-down">Class</v-col>
            <v-col class="text-right title mr-5 pr-5 hidden-sm-and-down">Date</v-col>
            <v-col class="text-right title mr-5 pr-5 hidden-sm-and-down">Weight</v-col>
            <v-col class="text-right title mr-5 pr-5 hidden-sm-and-down">Price</v-col>
          </v-row>
        </v-list-item>

        <v-list-item
          class="app-list-row"
          :class="{
            'app-list-row__selected': isSelected(item.id),
            'app-list-row__active': $route.params.id === item.id
          }"
          :key="`v-list-item-${i}`"
          @click.stop="addOrRemove(item)"
        >
          <v-list-item-avatar>
            <template v-if="isSelected(item.id)">
              <v-avatar
                class="list-avatar list-avatar__selected"
                size="40px"
                color="accent"
                @click.stop="addOrRemove(item)"
              >
                <v-icon color="white">mdi-check</v-icon>
              </v-avatar>
            </template>
            <template v-else>
              <v-avatar class="list-avatar" size="40px" @click.stop="addOrRemove(item)">
                <img :src="item.imageURL" :alt="item.id" />
              </v-avatar>
            </template>
          </v-list-item-avatar>

          <v-row justify="space-between" align="center">
            <v-col>
              <span class="font-weight-bold">{{ item.class }}</span>
            </v-col>
            <v-col
              class="text-right mr-5 pr-5 hidden-sm-and-down"
            >{{ Date(item.created).substr(0, 21) }} g</v-col>
            <v-col class="text-right mr-5 pr-5 hidden-sm-and-down">{{ item.weight }} g</v-col>
            <v-col class="text-right mr-5 pr-5 hidden-sm-and-down">${{ item.weightedPrice }}</v-col>
          </v-row>

          <v-list-item-action v-if="!order" class="app-list-actions justify-center">
            <v-row>
              <v-btn text icon @click.stop="deleteItem(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-row>
          </v-list-item-action>
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
    <v-dialog
      v-model="deleteDialog"
      persistent
      :max-width="$vuetify.breakpoint.xsAndDown ? 290 : 500"
    >
      <v-card v-if="selected.length">
        <v-card-title class="headline">
          {{
          `Are you sure you want to delete ${
          selected.length === 1
          ? " " + selected[0].class
          : `${selected.length} items`
          }?`
          }}
        </v-card-title>
        <v-card-text>This action is irreversible. All settings will be lost.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" text @click="deleteItems(selected)">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-list>
</template>

<script>
import { mapState } from "vuex";
import DatabaseMixin from "@/mixins/DatabaseMixin.vue";
import { storage } from "@/firebase.js";

export default {
  name: "ItemsList",
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [DatabaseMixin],
  data() {
    return {
      selected: [],
      descending: false,
      sortBy: "class",
      deleteDialog: false
    };
  },
  computed: {
    ...mapState({
      notifications: state => state.notifications
      // menuItems: state => state.menuItems
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
      return this.order ? this.order.items : this.itemsInCurrentOrder;
    },
    collectionRef() {
      return this.$firestoreRefs.predictions;
    }
  },
  methods: {
    getImageURL(filename) {
      //   console.log(filename);
      // Create a reference with an initial file path and name
      const imageRef = this.getImageRefByFilename(filename);
      console.log(imageRef);
      const url = this.getURLfromRef(imageRef);
      //   console.log(url);
      return url;
    },
    getImageRefByFilename(filename) {
      const folderRef = storage.ref(`/predictions`);
      folderRef.listAll().then(res => {
        return res.itemsInCurrentOrder.find(itemRef => {
          console.log(itemRef.name);
          return itemRef.name.includes(filename);
        });
      });
    },
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
      if (!this.order) {
        var index = this.selected.indexOf(item);
        if (index === -1) {
          this.selected.push(item);
        } else {
          this.selected.splice(index, 1);
        }
      } else {
        alert(JSON.stringify(item, null, 2));
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
      this.itemsInCurrentOrder = this.itemsInCurrentOrder.filter(
        itemInOrder => itemInOrder !== item
      );
      this.deleteDialog = false;
      this.selected = [];
    },
    openDialog(type, data = null) {
      this.$store.commit("OPEN_DIALOG", { type: type, data: data });
    },
    getUID() {
      return (
        "_" +
        Math.random()
          .toString(36)
          .substr(2, 9)
      );
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

.list-avatar {
  border-radius: 7px !important;
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
