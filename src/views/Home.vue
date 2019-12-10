<template>
  <div class="app-view">
    <h1>Home</h1>
    <v-stepper non-linear>
      <v-stepper-header>
        <v-stepper-step editable step="1">Select campaign settings</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step editable step="2">Create an ad group</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3" editable>Create an ad</v-stepper-step>
      </v-stepper-header>
    </v-stepper>
  </div>
</template>

<script>
import DatabaseMixin from "@/mixins/DatabaseMixin.vue";

export default {
  name: "home",
  mixins: [DatabaseMixin]
};
</script>