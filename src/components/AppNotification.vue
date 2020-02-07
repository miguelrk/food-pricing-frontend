<template>
  <v-snackbar
    v-model="model"
    :color="color"
    :style="style"
    :timeout="timeoutMs"
    :multi-line="multiLine"
    :vertical="vertical"
    bottom
    centered
    class="app-notification"
  >
    {{ text }}
    <v-btn
      v-if="button"
      text
      :color="button.color"
      @click.capture="button.clickHandler()"
    >{{ button.text }}</v-btn>
  </v-snackbar>
</template>

<script>
import store from "@/store/index.js";
import { mapState } from "vuex";

export default {
  name: "AppNotification",
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      model: true,
      text: "",
      type: "",
      button: {},
      closeable: false,
      timeoutMs: 6000,
      multiLine: false,
      vertical: false,
      style: ""
    };
  },
  computed: {
    ...mapState({
      darkMode: state => state.darkMode
    }),
    notifications: {
      get() {
        return store.state.notifications;
      },
      set(value) {
        this.$store.commit("SET", {
          prop: "notifications",
          value: value
        });
      }
    }
  },
  watch: {
    // Fire notifications when notifications array changes
    notification: {
      immediate: true,
      deep: true,
      handler(newVal) {
        this.fireNotification(newVal.text, newVal.type, newVal.options);
      }
    }
  },
  methods: {
    /**
     * @param model               - Model for visibility
     * Snackbar options
     * @param text                - Snackbar text
     * @param type                - Snackbar pre-defined type (error, info, warning, success)
     * @param options.button      - Button options (color, text, clickHandler)
     * @param options.closeable   - Overrides button options
     * @param options.multiLine   - Gives the snackbar a larger minimum height
     * @param options.timeoutMs   - Time (in milliseconds) to wait until snackbar is automatically hidden. Use 0 to keep open indefinitely
     * @param options.vertical    - Stacks snackbar content on top of the actions (button)
     *
     * Usage from any component like so:
     *
     *   this.$store.commit("FIRE_NOTIFICATION", notificationObject);
     *
     * or directly:
     *
     *   this.$store.commit("ADD", {
     *   prop: "notifications",
     *   value: notificationObject
     *   }
     *  });
     */
    fireNotification(text, type = "", options = {}) {
      const i = this.notifications.length - 1;
      this.model = true;
      this.text = text;

      // Set default options:
      const maxCount = 4;
      this.style = `top: 64px`;
      this.style = `margin-top:${54 + 54 * ((i % maxCount) - 1)}px`; // offsets notifications in a stack of maxCount
      this.setNotificationTheme(type);

      // Set custom options:
      this.timeoutMs = options.timeoutMs === 0 ? 0 : 6000; // prevents falsey values
      this.multiLine = options.multiLine ? options.multiLine : false;
      this.vertical = options.vertical ? options.vertical : false;
      // Button options
      if (options.button) {
        this.button.text = options.button.text ? options.button.text : "";
        this.button.clickHandler = options.button.clickHandler
          ? options.button.clickHandler
          : this.closeNotification;
      }

      // override button values
      if (options.closeable) {
        this.button.text = "Dismiss";
        this.button.clickHandler = this.closeNotification;
      }

      if (this.timeoutMs !== 0) {
        setTimeout(() => {
          // remove notification from array in vuex store
          this.$store.commit("SET", {
            prop: "notifications",
            value: []
          });
        }, this.timeoutMs);
      }
    },
    setNotificationTheme(type) {
      switch (type) {
        case "error":
          this.color = this.darkMode ? "error" : "error";
          this.button.color = "white";
          break;
        case "info":
          this.color = this.darkMode ? "info" : "info";
          this.button.color = "white";
          break;
        case "success":
          this.color = this.darkMode ? "success" : "success";
          this.button.color = "white";
          break;
        case "warning":
          this.color = this.darkMode ? "warning" : "warning";
          this.button.color = "white";
          break;
        default:
          this.color = "";
          this.button.color = "secondary";
          break;
      }
    },
    // Close the snackbar
    closeNotification() {
      this.model = false;
    }
  }
};
</script>

<style>
/* .app-notification {
  position: absolute !important;
  top: 80px !important;
} */
</style>