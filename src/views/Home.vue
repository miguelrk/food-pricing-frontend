<template>
  <div class="app-view">
    <h1 class="hidden-md-and-down">Home</h1>
    <v-stepper v-model="model">
      <v-stepper-header>
        <v-stepper-step :complete="model > 1" step="1">Scan your food</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="model > 2" step="2" editable>Review your order</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step
          :complete="model > 3"
          step="3"
          :editable="Boolean(itemsInCurrentOrder.length)"
        >Payment</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card flat class="mb-12">
            <!-- CAMERA STREAM -->
            <template v-if="state === 'init'">
              <v-card-title>
                <!-- <v-icon left large>mdi-food</v-icon> -->
                Scan your food
              </v-card-title>
              <v-card-subtitle>Place food item below camera and wait to be scanned</v-card-subtitle>
              <v-card-text>
                <v-row justify="center" align="center">
                  <!-- <v-img
                    src="https://miro.medium.com/max/1280/1*3lAxV0t43t9KFf0q4EJXNA.gif"
                    contain
                    height="400px"
                  ></v-img>-->
                  <iframe frameborder="0" :src="settings.cameraStreamHost"></iframe>
                </v-row>
              </v-card-text>
            </template>

            <!-- LOADING PLACEHOLDER WHILE IMAGE IS BEING PROCESSED IN THE BACKEND (INFERENCE STEP) -->
            <template v-else-if="state === 'inference'">
              <v-card-title>
                <!-- <v-icon left large>mdi-camera</v-icon> -->
                Detecting food item...
              </v-card-title>
              <v-card-subtitle>Please do not move food item</v-card-subtitle>
              <v-card-text>
                <v-row class="fill-height" column justify="center" align="center">
                  <v-progress-circular :size="50" color="secondary" indeterminate></v-progress-circular>
                </v-row>
              </v-card-text>
            </template>

            <!-- DISPLAY INFERENCE RESULTS -->
            <template v-else-if="state === 'feedback'">
              <template v-if="!correctionDialog">
                <v-card-title>
                  <!-- <v-icon left large>mdi-check</v-icon> -->
                  Is the food item correct?
                </v-card-title>
                <v-card-subtitle>
                  Your feedback helps us improve our
                  algorithms
                </v-card-subtitle>
                <v-card-text>
                  <v-row justify="center" align="center">
                    <v-img
                      v-if="prediction.imageURL"
                      :src="prediction.imageURL"
                      contain
                      height="400px"
                    ></v-img>
                  </v-row>
                </v-card-text>
              </template>

              <!-- DISPLAY CLASSES FOR MANUAL CLASSIFICATION (ACTIVE LEARNING) -->
              <template v-else-if="correctionDialog">
                <v-card-title>
                  <!-- <v-icon left large>mdi-question</v-icon> -->
                  Select your food
                </v-card-title>
                <v-card-subtitle>Select the correct food from below</v-card-subtitle>
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
                              <span class="font-weight-bold">{{ menuItem.class }}</span>
                            </v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-action-text>{{ menuItem.price }} EUR</v-list-item-action-text>
                        </v-list-item>
                        <v-hover>
                          <template #default="{ hover }">
                            <div class="pa-2">
                              <v-img
                                :src="menuItem.imageURL"
                                :alt="`${menuItem.class}`"
                                height="194"
                                :key="`v-img-${i}`"
                              >
                                <v-fade-transition>
                                  <v-overlay v-if="hover" absolute color="primary" opacity="0.40">
                                    <v-btn
                                      color="primary"
                                      depressed
                                      :key="`dialog-btn-${i}`"
                                      @click="updateClass(menuItem)"
                                    >Select</v-btn>
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
              <v-btn color="primary" @click="makePrediction()">
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
                @click="makePrediction()"
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
              <!-- <v-icon left large>mdi-receipt</v-icon> -->
              Review your order
            </v-card-title>
            <v-card-subtitle>
              Keep adding items to your order or proceed to
              check-out
            </v-card-subtitle>
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
              <!-- <v-icon left large>mdi-contactless-payment</v-icon> -->
              Confirm payment
            </v-card-title>
            <v-card-subtitle>Place card above scanner</v-card-subtitle>
            <v-card-text>
              <v-row>
                <v-col xs8>
                  <div class="text--primary">Accepted payment methods include:</div>
                  <br />
                  <br />
                  <v-img
                    width="300"
                    contain
                    src="https://upload.wikimedia.org/wikipedia/commons/5/57/Paypa.png"
                  ></v-img>
                  <br />
                  <div class="text--primary">Enjoy your meal!</div>
                </v-col>
                <v-col xs4>
                  <v-row
                    v-for="(item, i) in itemsInCurrentOrder"
                    :key="`p-${i}`"
                    justify-space-between
                  >
                    <v-col>{{ item.class }}</v-col>
                    <v-col style="text-align:right;">{{ item.price }}</v-col>
                  </v-row>
                  <br />
                  <p class="subheader text--primary strong" style="text-align:right;">TOTAL</p>
                  <p
                    class="display-1 text--primary"
                    style="text-align:right;"
                  >{{ getTotalSum() }} EUR</p>
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
      correctionDialog: false,
      prediction: {
        id: "",
        class: "",
        orderId: "",
        price: "",
        weight: "",
        created: "",
        imageURL: ""
      },
      predictionsRef: storage.ref("/predictions")
    };
  },
  computed: {
    ...mapState({
      notifications: state => state.notifications,
      menuItems: state => state.menuItems,
      itemsInCurrentOrder: state => state.itemsInCurrentOrder
    })
  },
  mounted() {
    // Find all the prefixes and items.
    this.getImageUrls(this.predictionsRef);
  },
  methods: {
    makePrediction() {
      this.state = "inference";
      this.correctionDialog = false;

      const url = `${this.settings.deviceHost}/predict`;

      console.log(`Getting prediction...`);
      console.log(`GET ${this.settings.deviceHost}/predict`);

      this.getPrediction(url)
        .then(data => {
          this.prediction = data;
          console.log(this.prediction);
        })
        .finally(() => {
          this.state = "feedback";
          this.getImageUrls(this.predictionsRef).then(
            (this.prediction.imageURL = this.imageURLs[-1])
          );
        });
    },
    async getPrediction(url) {
      try {
        let response = await fetch(url);
        return response.json();
      } catch (error) {
        console.error(error);
        this.$store.commit("FIRE_NOTIFICATION", {
          text: error,
          type: "error"
        });
      }
    },
    // getImageURLOfPrediction(urls) {
    //   const url = urls.find(url => url.includes(this.prediction.id));
    //   console.log(url);
    //   return url;
    // },
    updateClass(menuItem) {
      this.prediction.class = menuItem.class;
      this.addPredictionToOrder();
    },
    addPredictionToOrder() {
      this.$store.commit("ADD", {
        prop: "itemsInCurrentOrder",
        value: this.prediction
      });
      console.log("Added item to order:", this.prediction);
      this.model = 2;
      this.state = "init";
    },
    async getImageUrls(folderRef) {
      let urls = [];
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
                urls.push(url);
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
        .finally(() => {
          this.imageURLs = urls;
          console.log(this.imageURLs);
        });
      return this.imageURLs;
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
      this.initPrediction();
    },
    backToStart() {
      this.model = 1;
      this.state = "init";
    },
    getUID() {
      return (
        "_" +
        Math.random()
          .toString(36)
          .substr(2, 9)
      );
    },
    initPrediction() {
      return {
        id: "",
        class: "",
        orderId: "",
        price: "",
        weight: "",
        created: ""
      };
    },
    getTotalSum() {
      if (this.itemsInCurrentOrder.length) {
        return this.itemsInCurrentOrder
          .map(item => item.price)
          .reduce((prev, next) => prev + next);
      } else return 0;
    }
  }
};
</script>

<style>
.app-view {
  height: 100% !important;
}

.with-padding .v-stepper__content {
  height: calc(100vh - 250px);
}

.without-padding .v-stepper__content {
  height: calc(100vh - 72px - 64px);
}

/* .v-stepper {
  height: 100%;
} */

.v-stepper__wrapper {
  height: 100%;
}

.v-stepper__wrapper .v-card {
  height: 100%;
}

.v-stepper__wrapper .v-card__text {
  /* minus v-card-title height and v-card-actions height */
  height: calc(100% - 48px - 38px - 52px - 16px);
  padding: 16px !important; /* overrides .v-card__title + .v-card__text { padding-top: 0px; } */
  margin-bottom: 16px !important; /* spaces v-list-action buttons */
  overflow-y: auto;
}

iframe {
  width: 755px;
  height: 424px;
  max-width: 100%;
  max-height: calc((100% - 40px) / (16 / 9));
}

iframe html body {
  overflow: hidden;
}
</style>
