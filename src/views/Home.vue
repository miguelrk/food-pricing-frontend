<template>
  <div class="app-view">
    <h1>Home</h1>
    <v-stepper v-model="model">
      <v-stepper-header>
        <v-stepper-step :complete="model > 1" step="1"
          >Place your food</v-stepper-step
        >
        <v-divider></v-divider>
        <v-stepper-step :complete="model > 2" step="2"
          >Confirm selection</v-stepper-step
        >
        <v-divider></v-divider>
        <v-stepper-step :complete="model > 3" step="3" editable
          >Review your order</v-stepper-step
        >
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card flat class="mb-12">
            <!-- CAMERA STREAM -->
            <template v-if="state === 'init'">
              <v-card-title>
                <v-icon left large>mdi-food</v-icon>Position food item below
                camera
              </v-card-title>
              <v-card-text>
                <v-row justify="center" align="center">
                  <v-img
                    src="https://miro.medium.com/max/1280/1*3lAxV0t43t9KFf0q4EJXNA.gif"
                    contain
                    height="400px"
                  ></v-img>
                </v-row>
              </v-card-text>
            </template>

            <!-- LOADING PLACEHOLDER WHILE IMAGE IS BEING PROCESSED IN THE BACKEND (INFERENCE STEP) -->
            <template v-else-if="state === 'inference'">
              <v-card-title>
                <v-icon left large>mdi-picture</v-icon>Detecting food item...
              </v-card-title>
              <v-card-text>
                <v-row
                  class="fill-height"
                  column
                  justify="center"
                  align="center"
                >
                  <v-progress-circular
                    :size="50"
                    color="secondary"
                    indeterminate
                  ></v-progress-circular>
                </v-row>
              </v-card-text>
            </template>

            <!-- DISPLAY INFERENCE RESULTS -->
            <template v-else-if="state === 'feedback'">
              <template v-if="!correctionDialog">
                <v-card-title>
                  <v-icon left large>mdi-question</v-icon>Is the food item
                  correct?
                </v-card-title>
                <v-card-text>
                  <v-row justify="center" align="center">
                    <v-img
                      :src="imageURLs[imageURLs.length - 1]"
                      contain
                      height="400px"
                    ></v-img>
                  </v-row>
                </v-card-text>
              </template>

              <!-- DISPLAY CLASSES FOR MANUAL CLASSIFICATION (ACTIVE LEARNING) -->
              <template v-else-if="correctionDialog">
                <v-card-title>
                  <v-icon left large>mdi-question</v-icon>Please select the
                  correct food item
                </v-card-title>
                <v-card-text>
                  <v-row align="center" dense>
                    <!-- GRID VIEW FOR LARGE SCREENS -->
                    <v-col
                      v-for="(menuItem, i) in menuItems"
                      :key="`menu-item-${i}`"
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
                              <span class="font-weight-bold">
                                {{ menuItem.class }}
                              </span>
                            </v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-action-text
                            >{{ menuItem.price }} EUR</v-list-item-action-text
                          >
                        </v-list-item>
                        <v-hover>
                          <template #default="{ hover }">
                            <div class="pa-2">
                              <v-img
                                :src="menuItem.imageURL"
                                :alt="`Asterisc widget ${menuItem.name}`"
                                height="194"
                                :key="`widget-img-${i}`"
                              >
                                <v-fade-transition>
                                  <v-overlay
                                    v-if="hover"
                                    absolute
                                    color="primary"
                                    opacity="0.40"
                                  >
                                    <v-btn
                                      color="primary"
                                      depressed
                                      :key="`widget-dialog-btn-${menuItem.id}`"
                                      @click="updateClass(menuItem)"
                                      >Select</v-btn
                                    >
                                  </v-overlay>
                                </v-fade-transition>
                              </v-img>
                            </div>
                          </template>
                        </v-hover>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </template>
            </template>

            <v-card-actions v-if="state === 'init'">
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="getPrediction()">
                <v-icon left>mdi-camera</v-icon>Scan item
              </v-btn>
            </v-card-actions>

            <v-card-actions v-else>
              <v-btn text @click="reset()">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn
                text
                outlined
                color="primary"
                @click="getPrediction()"
                :disabled="state === 'inference'"
              >
                <v-icon left>mdi-camera</v-icon>Re-scan
              </v-btn>
              <v-btn
                color="error"
                @click="correctionDialog = true"
                :disabled="state === 'inference'"
              >
                <v-icon left>mdi-close</v-icon>Wrong
              </v-btn>
              <v-btn
                color="success"
                @click="addPredictionToOrder()"
                :disabled="state === 'inference'"
              >
                <v-icon left>mdi-check</v-icon>Right
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card flat class="mb-12">
            <v-card-title>
              <v-icon left large>mdi-receipt</v-icon>Review your order
            </v-card-title>
            <v-card-text>
              <items-list></items-list>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="reset()">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" outlined @click="backToStart()">
                <v-icon left>mdi-plus</v-icon>Add item
              </v-btn>
              <v-btn color="primary" @click="model = 3">
                <v-icon left>mdi-credit-card-outline</v-icon>Check-out
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card flat class="mb-12">
            <v-card-title large>
              <v-icon left large>mdi-contactless-payment</v-icon>Place card
              above scanner
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col xs6>
                  <div class="text--primary">
                    Accepted payment methods include:
                  </div>
                  <br />
                  <br />
                  <v-img
                    width="300"
                    contain
                    src="https://upload.wikimedia.org/wikipedia/commons/5/57/Paypa.png"
                  ></v-img>
                  <br />
                  <div class="text--primary">
                    Enjoy your meal!
                  </div></v-col
                >
                <v-col xs6
                  ><p v-for="(item, i) in itemsInCurrentOrder" :key="`p-${i}`">
                    {{
                      item.class
                    }}
                    .....................................................................................................................
                    {{ item.price }}
                  </p>
                  <v-subheader>TOTAL</v-subheader>
                  <p class="display-1 text--primary">
                    8.79 EUR
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="reset()">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn text @click="goBackToFeedback()">Back</v-btn>
              <v-btn color="primary" @click="model = 1">
                <v-icon left>mdi-credit-card-outline</v-icon>Purchase
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import { mapState } from "vuex";
import DatabaseMixin from "@/mixins/DatabaseMixin.vue";
import { storage } from "@/firebase.js";

export default {
  name: "home",
  components: {
    ItemsList: () => import("@/components/ItemsList.vue")
  },
  mixins: [DatabaseMixin],
  data() {
    return {
      model: 1,
      state: "init",
      imageURLs: [],
      correctionDialog: false
    };
  },
  computed: {
    ...mapState({
      notifications: state => state.notifications,
      proxyHost: state => state.notifications,
      deviceHost: state => state.deviceHost,
      menuItems: state => state.menuItems,
      itemsInCurrentOrder: state => state.itemsInCurrentOrder
    })
  },
  mounted() {
    const predictionsRef = storage.ref("/predictions");
    // Find all the prefixes and items.
    this.getImageUrls(predictionsRef);
  },
  methods: {
    getPrediction() {
      this.state = "inference";
      this.correctionDialog = false;
      setTimeout(() => {
        this.state = "feedback";
      }, 1000);
      this.prediction = {
        id: this.itemsInCurrentOrder.length,
        class: "Bread",
        price: 3.5
      };
    },
    updateClass(menuItem) {
      this.prediction.class = menuItem.class;
      this.prediction.price = menuItem.price;
      this.prediction.imageURL = menuItem.imageURL;
      this.addPredictionToOrder();
    },
    addPredictionToOrder() {
      this.$store.commit("ADD", {
        prop: "itemsInCurrentOrder",
        value: this.prediction
      });
      this.model = 2;
      this.state = "init";
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
              })
              .finally(() => console.log("Done"));
          });
        })
        .catch(error => {
          // Uh-oh, an error occurred!
          console.error(error);
        });
    },
    goBackToFeedback() {
      this.model = 2;
      this.state = "feedback";
    },
    purchase() {
      this.$store.commit("FIRE_NOTIFICATION", {
        text: "Payment successful",
        type: "success"
      });
      this.reset();
    },
    reset() {
      this.backToStart();
      this.$store.commit("SET", {
        prop: "itemsInCurrentOrder",
        value: []
      });
    },
    backToStart() {
      this.model = 1;
      this.state = "init";
    }
  }
};
</script>

<style>
.app-view {
  height: 100% !important;
}

.v-stepper__content {
  height: calc(100vh - 300px);
}

.v-stepper__wrapper {
  height: 100%;
}

.v-stepper__wrapper .v-card {
  height: 100%;
}

.v-stepper__wrapper .v-card__text {
  /* minus v-card-title height and v-card-actions height */
  height: calc(100% - 64px - 52px);
  padding: 16px !important; /* overrides .v-card__title + .v-card__text { padding-top: 0px; } */
  overflow-y: auto;
}
</style>
