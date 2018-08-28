<template>
  <v-list dense>
    <v-list-tile v-for="item in data" :key="item.id" :href="item.url">
      <v-list-tile-avatar v-if="icon" :size="16">
        <img v-if="item.icon" :src="item.icon">
        <v-icon v-else>insert_drive_file</v-icon>
      </v-list-tile-avatar>
      <v-list-tile-content :title="item.url" class="caption">
        <v-list-tile-sub-title v-if="item.title && item.title.length">
          {{ item.title }}
        </v-list-tile-sub-title>
        <v-list-tile-sub-title v-else>{{ item.url }}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action v-if="item.date">
        <v-list-tile-action-text>
          {{ item.date.toLocaleDateString($i18n.locale, $options.dateOption) }}
        </v-list-tile-action-text>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
</template>
<script>
import * as VList from 'vuetify/es5/components/VList';

// @vue/component
export default {
  name: 'List',
  components: {
    ...VList,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    icon: {
      type: Boolean,
      default: false,
    },
  },
  dateOption: { hour: '2-digit', minute: '2-digit' },
};
</script>
<style lang="scss" rel='stylesheet/scss' scoped>
 .v-list__tile__avatar {
    min-width: 29px!important;
  }
  /deep/ .v-list__tile {
    height: 34px!important;
  }
  .v-list__tile__action {
    flex-shrink: 0!important;
  }
</style>
