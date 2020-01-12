<template>
  <div class="app-view">
    <h1>Menu</h1>
    <v-container fluid>
      <v-row align="center" dense>
        <!-- GRID VIEW FOR LARGE SCREENS -->
        <v-col
          v-for="item in menuItems"
          :key="item.title"
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
              <v-list-item-action-text>
                {{ item.price }} EUR
              </v-list-item-action-text>
            </v-list-item>
            <v-hover>
              <template #default="{ hover }">
                <div class="pa-2">
                  <v-img
                    :src="item.imageURL"
                    :alt="`Asterisc widget ${item.name}`"
                    height="194"
                    :key="`widget-img-${item.id}`"
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
                          :key="`widget-dialog-btn-${item.id}`"
                          @click="updateClass(item)"
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
      <!-- <v-row>
        <v-col v-for="n in 9" :key="n" class="d-flex child-flex" cols="4">
          <v-card flat tile class="d-flex">
            <v-img
              :src="`https://picsum.photos/500/300?image=${n * 5 + 10}`"
              :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`"
              aspect-ratio="1"
              class="grey lighten-2"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-card>
        </v-col>
      </v-row> -->
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import DatabaseMixin from "@/mixins/DatabaseMixin.vue";

export default {
  name: "Menu",
  mixins: [DatabaseMixin],
  computed: {
    ...mapState({
      notifications: state => state.notifications,
      proxyHost: state => state.notifications,
      deviceHost: state => state.deviceHost,
      menuItems: state => state.menuItems,
      itemsInCurrentOrder: state => state.itemsInCurrentOrder
    })
  }
};
</script>

<style>
.menu {
  height: 100%;
  width: 100%;
}
</style>
