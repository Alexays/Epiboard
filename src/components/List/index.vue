<template>
  <v-list dense>
    <recycle-list :items="data" :item-height="34" :class="{ 'pa-3': padding }" class="scroller">
      <template scope="{item}">
        <v-list-tile :href="item.url" @click="$emit('clicked', item)">
          <v-list-tile-avatar :size="16">
            <slot :item="item" name="icon">
              <v-img v-if="item.icon" :src="item.icon"/>
              <v-icon v-else-if="icon">insert_drive_file</v-icon>
            </slot>
          </v-list-tile-avatar>
          <v-list-tile-content :title="item.url" class="caption">
            <v-list-tile-sub-title>
              <slot :item="item" name="content">
                {{ item.title && item.title.length ? item.title : item.url }}
              </slot>
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-list-tile-action-text>
              <slot :item="item" name="action">
                <span v-if="item.date">
                  {{ item.date.toLocaleDateString($t('locale'), timeOptions) }}
                </span>
              </slot>
            </v-list-tile-action-text>
          </v-list-tile-action>
        </v-list-tile>
      </template>
    </recycle-list>
  </v-list>
</template>
<script>
import { RecycleList } from 'vue-virtual-scroller';
import date from '@/mixins/date';

// @vue/component
export default {
  name: 'List',
  components: {
    RecycleList,
  },
  mixins: [date],
  props: {
    data: {
      type: Array,
      required: true,
    },
    icon: {
      type: Boolean,
      default: false,
    },
    padding: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
