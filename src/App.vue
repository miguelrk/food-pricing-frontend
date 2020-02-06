<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-avatar>
          <v-icon large dark>mdi-food</v-icon>
        </v-avatar>

        <v-toolbar-title v-if="$vuetify.breakpoint.smAndUp" class="ml-3">Food App</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-tabs background-color="transparent" right>
        <v-tab
          @click="$router.push('/')"
          :class="{
            'without-padding': $isMobile() || $vuetify.breakpoint.smAndDown
          }"
        >
          <template v-if="!$isMobile() || $vuetify.breakpoint.mdAndUp">Home</template>
          <template v-else>
            <v-icon>mdi-home</v-icon>
          </template>
        </v-tab>
        <v-tab @click="$router.push('/orders')">
          <template v-if="!$isMobile() || $vuetify.breakpoint.mdAndUp">Orders</template>
          <template v-else>
            <v-icon>mdi-receipt</v-icon>
          </template>
        </v-tab>
        <v-tab @click="$router.push('/results')">
          <template v-if="!$isMobile() || $vuetify.breakpoint.mdAndUp">Results</template>
          <template v-else>
            <v-icon>mdi-menu</v-icon>
          </template>
        </v-tab>
        <v-tab @click="$router.push('/menu')">
          <template v-if="!$isMobile() || $vuetify.breakpoint.mdAndUp">Menu</template>
          <template v-else>
            <v-icon>mdi-menu</v-icon>
          </template>
        </v-tab>
      </v-tabs>

      <v-btn icon @click="toggleFullscreen()">
        <v-icon>
          {{
          fullscreen ? "mdi-fullscreen-exit" : "mdi-fullscreen"
          }}
        </v-icon>
      </v-btn>
      <v-toolbar-items>
        <v-dialog v-model="dialog" width="500">
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-settings</v-icon>
            </v-btn>
          </template>

          <v-card>
            <form>
              <v-card-title primary-title>Settings</v-card-title>

              <v-card-text>
                <v-text-field
                  v-model="deviceHostProvisional"
                  label="Device Host"
                  required
                  outlined
                  dense
                ></v-text-field>
                <v-text-field
                  v-model="cameraStreamHostProvisional"
                  label="Camera Stream Host"
                  required
                  outlined
                  dense
                ></v-text-field>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="dialog = false">close</v-btn>
                <v-btn class="mr-4" text color="primary" @click="submitChanges()">
                  <v-icon left>mdi-content-save-edit</v-icon>save
                </v-btn>
              </v-card-actions>
            </form>
          </v-card>
        </v-dialog>
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      <router-view
        width="100%"
        :class="{
          'with-padding': !$isMobile() || $vuetify.breakpoint.lgAndUp,
          'without-padding': $isMobile() || $vuetify.breakpoint.mdAndDown
        }"
      ></router-view>
    </v-content>

    <!------------------------------------------------------------------------>
    <app-notification
      v-for="(notification, i) in notifications"
      :key="`app-notification-${i}`"
      :notification="notification"
    ></app-notification>
    <app-notification-update></app-notification-update>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import { database } from "@/firebase.js";
import DatabaseMixin from "@/mixins/DatabaseMixin.vue";
import FullscreenMixin from "@/mixins/FullscreenMixin.vue";
import AppNotification from "@/components/AppNotification";
import AppNotificationUpdate from "@/components/AppNotificationUpdate";

export default {
  name: "App",
  components: {
    AppNotification,
    AppNotificationUpdate
  },
  mixins: [DatabaseMixin, FullscreenMixin],
  data() {
    return {
      dialog: false,
      deviceHostProvisional: "",
      cameraStreamHostProvisional: ""
    };
  },
  computed: {
    ...mapState({
      notifications: state => state.notifications,
      itemsInCurrentOrder: state => state.itemsInCurrentOrder
    })
  },
  watch: {
    settings: {
      immediate: true,
      handler(newVal) {
        this.deviceHostProvisional = newVal.deviceHost;
        this.cameraStreamHostProvisional = newVal.cameraStreamHost;
        console.log("Updated settings:", newVal);
      }
    },
    $online: {
      // fires notification when vue-offline-prop detects offline state
      immediate: true,
      handler(newVal) {
        if (!newVal) {
          let notification = {
            text: "You are currently offline!",
            type: "", // options are "" for black, "info", "error", "success" ...
            options: {
              timeoutMs: 0 // in milliseconds
            }
          };
          this.$store.commit("FIRE_NOTIFICATION", notification);
        } // or clears it when connection returns
        else this.$store.commit("CLEAR_NOTIFICATIONS");
      }
    }
  },
  methods: {
    submitChanges() {
      this.dialog = false;

      const collectionRefSettings = database.collection("settings");

      const data = {
        deviceHost: this.deviceHostProvisional,
        cameraStreamHost: this.cameraStreamHostProvisional
      };

      this.updateDoc(collectionRefSettings, "PwmSaP1FUxeigoq4xKte", data);
    }
  }
};
</script>

<style>
html,
body {
  overflow-y: auto !important;
}

.app-view {
  height: 100%;
}

.app-view h1 {
  margin-bottom: 16px;
}

.with-padding {
  padding: 24px 96px;
}

.without-padding {
  padding: 0px;
}

.without-padding.v-tab {
  padding-left: 6px;
  padding-right: 6px;
}

/***************************custom scrollbar css********************************/

/* Turn on custom 8px wide scrollbar */
::-webkit-scrollbar {
  width: 10px; /* 1px wider than Lion. */
  /* This is more usable for users trying to click it. */
  background-color: rgba(0, 0, 0, 0);
  border-radius: 100px;
  -webkit-border-radius: 100px;
}
/* hover effect for both scrollbar area, and scrollbar 'thumb' */
::-webkit-scrollbar:hover {
  background-color: rgba(0, 0, 0, 0.09);
}

/* The scrollbar 'thumb' ...that marque oval shape in a scrollbar */
::-webkit-scrollbar-thumb:vertical {
  /* This is the EXACT color of Mac OS scrollbars.
     Yes, I pulled out digital color meter */
  background: rgba(0, 0, 0, 0.15);
  border-radius: 100px;
  -webkit-border-radius: 100px;
  background-clip: padding-box;
  border: 2px solid rgba(0, 0, 0, 0);
  min-height: 10px; /*Prevent it from getting too small */
}
::-webkit-scrollbar-thumb:vertical:active {
  background: rgba(0, 0, 0, 0.2); /* Some darker color when you click it */
  border-radius: 100px;
  -webkit-border-radius: 100px;
}
</style>
