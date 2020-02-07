<template>
  <div class="app-view">
    <h1 class="hidden-md-and-down">Results</h1>
    <v-container fluid class="app-grid-container">
      <v-row align="center" dense>
        <!-- GRID VIEW FOR LARGE SCREENS -->
        <v-col
          v-for="(item, i) in predictions"
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
                  <span class="font-weight-bold">{{ item.label }}</span>
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action-text>{{ item.price }} EUR</v-list-item-action-text>
            </v-list-item>
            <v-hover>
              <template #default="{ hover }">
                <div class="pa-2">
                  <v-img
                    :src="imageURLs[i]"
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
                          @click="openAlert(item)"
                        >View Metadata</v-btn>
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
      imageURLs: []
    };
  },
  computed: {
    ...mapState({
      notifications: state => state.notifications,
      // menuItems: state => state.menuItems,
      itemsInCurrentOrder: state => state.itemsInCurrentOrder
    })
  },
  mounted() {
    const predictionsRef = storage.ref("/predictions");
    // Find all the prefixes and items.
    this.getImageUrls(predictionsRef);
  },
  methods: {
    openAlert(item) {
      alert(JSON.stringify(item, null, 4));
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
    }
  }
};
</script>

<style>
.menu {
  height: 100%;
  width: 100%;
}
</style>
