<template>
  <div class="app-view">
    <v-row fluid class="align-center">
      <h1 class="hidden-md-and-down">Menu</h1>
      <v-spacer></v-spacer>
      <v-btn
        class="justify-end"
        right
        floating
        outlined
        color="secondary"
        @click="openCreateDialog(newMenuItem)"
      >
        <v-icon left>mdi-plus</v-icon>Add
      </v-btn>
    </v-row>

    <v-container fluid class="app-grid-container">
      <v-row align="center" dense>
        <!-- GRID VIEW FOR LARGE SCREENS -->
        <v-col
          v-for="(item, i) in menuItems"
          :key="`v-col-${i}`"
          :cols="
            $vuetify.breakpoint.smAndDown
              ? 6
              : $vuetify.breakpoint.mdAndDown
              ? 4
              : $vuetify.breakpoint.lgAndDown
              ? 3
              : 2
          "
        >
          <v-card max-width="344" class="mx-auto">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <span class="font-weight-bold">{{ item.class }}</span>
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action-text>{{ item.price }} EUR</v-list-item-action-text>
            </v-list-item>
            <v-hover>
              <template #default="{ hover }">
                <div class="pa-2">
                  <v-img
                    :src="item.imageURL"
                    :alt="`${item.class}-${item.id}`"
                    height="194"
                    :key="`v-img-${i}`"
                  >
                    <v-fade-transition>
                      <v-overlay v-if="hover" absolute color="primary" opacity="0.40">
                        <v-btn
                          color="primary"
                          depressed
                          :key="`dialog-btn-${item.id}`"
                          @click="openUpdateDialog(item)"
                        >Edit item</v-btn>
                      </v-overlay>
                    </v-fade-transition>
                  </v-img>
                </div>
              </template>
            </v-hover>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- DIALOG TO CONFIRM DELETE -->
    <v-dialog
      v-model="editDialog"
      persistent
      :max-width="$vuetify.breakpoint.xsAndDown ? 290 : 500"
    >
      <v-card v-if="itemToEdit">
        <v-card-title class="headline">Menu item</v-card-title>
        <v-card-text class="pa-5">
          <!-- <v-subheader class="justify-center">Details</v-subheader> -->
          <v-text-field
            v-model="itemToEdit.class"
            append-icon="mdi-label"
            label="Class"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            v-model="itemToEdit.price"
            append-icon="mdi-currency-usd"
            label="Price (EUR/100g)"
            required
            outlined
            dense
            type="number"
            prefix="$"
          ></v-text-field>
          <!-- <v-subheader class="justify-center">Image</v-subheader> -->
          <v-text-field
            v-model="itemToEdit.imageURL"
            append-icon="mdi-link"
            label="image URL"
            outlined
            dense
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" text @click="remove(itemToEdit)">Delete</v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="editDialog = false">Cancel</v-btn>
          <v-btn v-if="dialogType === 'update'" color="primary" @click="update(itemToEdit)">Save</v-btn>
          <v-btn
            v-else-if="dialogType === 'create'"
            color="primary"
            @click="create(itemToEdit)"
          >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import DatabaseMixin from "@/mixins/DatabaseMixin.vue";
import { storage } from "@/firebase.js";

export default {
  name: "Menu",
  mixins: [DatabaseMixin],
  data() {
    return {
      imageURLs: [],
      dialogType: "update",
      editDialog: false,
      itemToEdit: null,
      file: null,
      newMenuItem: {
        id: "",
        class: "",
        price: "",
        imageURL: ""
      }
    };
  },
  computed: {
    ...mapState({
      notifications: state => state.notifications,
      // // menuItems: state => state.menuItems,
      itemsInCurrentOrder: state => state.itemsInCurrentOrder
    })
  },
  mounted() {
    const predictionsRef = storage.ref("/predictions");
    // Find all the prefixes and items.
    this.getImageUrls(predictionsRef);
  },
  methods: {
    openCreateDialog(item) {
      console.log(item);
      this.itemToEdit = item;
      this.dialogType = "create";
      this.editDialog = true;
    },
    openUpdateDialog(item) {
      console.log(item);
      this.itemToEdit = item;
      this.dialogType = "update";
      this.editDialog = true;
    },
    getImageUrls(folderRef) {
      folderRef
        .listAll()
        .then(res => {
          res.items.forEach(itemRef => {
            // All the items under listRef.
            // console.log("itemRef:", itemRef);
            itemRef
              .getDownloadURL()
              .then(url => {
                // console.log("url:", url);
                this.imageURLs.push(url);
              })
              .catch(error => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                  case "storage/object-not-found":
                    console.error("File doesn't exist", error);
                    break;

                  case "storage/unauthorized":
                    console.error(
                      "User doesn't have permission to access the object",
                      error
                    );
                    break;

                  case "storage/reseted":
                    console.error("User reseted the upload", error);
                    break;

                  case "storage/unknown":
                    console.error(
                      "Unknown error occurred, inspect the server response",
                      error
                    );
                    break;
                }
              });
          });
        })
        .catch(error => {
          // Uh-oh, an error occurred!
          console.error(error);
        })
        .finally(() => console.log(this.imageURLs));
    },
    create(item) {
      this.createDoc(this.$firestoreRefs.menuItems, item);
      this.editDialog = false;
    },
    update(item) {
      this.updateDoc(this.$firestoreRefs.menuItems, item.id, item);
      this.editDialog = false;
    },
    remove(item) {
      this.deleteDocById(this.$firestoreRefs.menuItems, item.id, item);
      this.editDialog = false;
    }
  }
};
</script>

<style>
.menu {
  height: 100%;
  width: 100%;
}

#dialog-image-preview {
  width: 300px;
  max-width: 100%;
}
</style>
