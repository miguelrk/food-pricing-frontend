<template>
  <v-snackbar v-model="showing" :timeout="timeout" bottom right class="snack">
    {{ text }}
    <v-spacer />
    <v-btn dark text color="secondary" @click.native="refreshApp()">{{ buttonText }}</v-btn>
  </v-snackbar>
</template>

<script>
// HOWTO: https://medium.com/@dougallrich/give-users-control-over-app-updates-in-vue-cli-3-pwas-20453aedc1f2
export default {
  name: "AppNotificationUpdate",
  data() {
    return {
      refreshing: false,
      registration: null,
      buttonText: "",
      text: "",
      showing: false,
      timeout: 0
    };
  },
  mounted() {
    // Listen for swUpdated event and display refresh snackbar as required.
    document.addEventListener("swUpdated", this.showRefreshUI, { once: true });
    // Refresh all open app tabs when a new service worker is installed.
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (this.refreshing) return;
      this.refreshing = true;
      window.location.reload();
    });
  },
  methods: {
    showRefreshUI(e) {
      // Display a snackbar inviting the user to refresh/reload the app due
      // to an app update being available.
      // The new service worker is installed, but not yet active.
      // Store the ServiceWorkerRegistration instance for later use.
      this.registration = e.detail;
      this.buttonText = "Update";
      this.text = "New version available!";
      this.showing = true;
    },
    refreshApp() {
      this.showing = false;
      // Protect against missing registration.waiting.
      if (!this.registration || !this.registration.waiting) {
        return;
      }
      this.registration.waiting.postMessage("skipWaiting");
    }
  }
};
</script>

<style scoped>
/* Provide better right-edge spacing when using an icon button there. */
.snack >>> .v-snack__content {
  padding-right: 16px;
}
</style>
