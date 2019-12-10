<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-avatar>
          <v-icon large dark>mdi-food</v-icon>
        </v-avatar>

        <v-toolbar-title class="ml-3">Food App</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-tabs background-color="transparent" right>
        <v-tab @click="$router.push('/')">Home</v-tab>
        <v-tab @click="$router.push('/record')">Record</v-tab>
        <v-tab @click="$router.push('/menu')">Menu</v-tab>
      </v-tabs>
      <v-toolbar-items>
        <v-btn icon>
          <v-icon>mdi-settings</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      <v-container>
        <v-row>
          <v-col xs12>
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},
  data: () => ({
    //
  }),
  watch: {
    data(newVal) {
      console.log(newVal);
    }
  }
};
</script>
