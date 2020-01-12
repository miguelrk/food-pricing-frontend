<template>
  <v-list two-line class="fill-height pa-0">
    <template v-if="itemsInCurrentOrder.length">
      <template v-for="(item, i) in itemsInCurrentOrder">
        <v-list-item
          class="app-list-row"
          :class="{
            'app-list-row__selected': isSelected(item.id),
            'app-list-row__active': $route.params.id === item.id
          }"
          :key="`v-list-item-${i}`"
          @click="() => pass"
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
              <v-avatar
                class="list-avatar"
                size="40px"
                @click.stop="addOrRemove(item)"
              >
                <img
                  :src="`https://picsum.photos/500/300?image=${i}`"
                  :alt="item.id"
                />
                <!-- <img :src="getImageURL(filenames[i])" :alt="item.id" /> -->
              </v-avatar>
            </template>
          </v-list-item-avatar>

          <v-row justify="space-between" align="center">
            <v-col>
              <span class="font-weight-bold">{{ item.class }}</span>
              <v-list-item-subtitle>{{ item.id }}</v-list-item-subtitle>
            </v-col>
            <v-col
              v-if="$vuetify.breakpoint.mdAndUp"
              class="text-right mr-5 pr-5"
              >{{ getItemPrice(item.class) }}</v-col
            >
          </v-row>

          <v-list-item-action class="app-list-actions justify-center">
            <v-row>
              <!-- <v-btn text icon>
                <v-icon>mdi-content-copy</v-icon>
              </v-btn> -->
              <v-btn text icon @click.stop="deleteDocs([item])">
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
        <v-card-text
          >This action is irreversible. All settings will be lost.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" text @click="deleteDocs(selected)">Delete</v-btn>
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
  mixins: [DatabaseMixin],
  data() {
    return {
      selected: [],
      descending: false,
      sortBy: "class",
      headers: [
        { text: "Class", align: "left", sortable: true, value: "class" },
        { text: "ID", align: "left", sortable: true, value: "id" }
      ],
      deleteDialog: false,
      // TODO: REMOVE AND USE ACTUAL IMAGE ID (ID.png)
      filenames: ["multi-gateway-manager-architecture", "widget-form"]
    };
  },
  computed: {
    ...mapState({
      notifications: state => state.notifications,
      proxyHost: state => state.notifications,
      deviceHost: state => state.deviceHost,
      menuItems: state => state.menuItems,
      itemsInCurrentOrder: state => state.itemsInCurrentOrder
    }),
    items() {
      return this.predictions;
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
    getItemPrice(itemClass) {
      return (
        this.menuItems.find(
          item => item.class.toLowerCase() === itemClass.toLowerCase()
        ).price + " EUR"
      );
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
    cloneDocs(selected) {
      selected.forEach(doc => {
        this.cloneDoc(this.collectionRef, doc); // from firestoreMixin.js
      });
      this.selected = [];
    },
    deleteDocs(selected) {
      selected.forEach(doc => {
        this.deleteDocById(this.collectionRef, doc.id); // from firestoreMixin.js
      });
      this.deleteDialog = false;
      this.selected = [];
    },
    openDialog(type, data = null) {
      this.$store.commit("OPEN_DIALOG", { type: type, data: data });
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
.app-list-row__active {
  /* active row when in split-view: */
  border-left: 6px solid #18ecc0;
  background-color: rgb(24, 236, 192, 0.1); /* shade row if active */
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
