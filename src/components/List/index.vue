<template>
  <v-list :class="{ 'pa-3': padding }" dense>
    <v-list-item
      v-for="item of data"
      :key="item.url+item.date"
      :href="item.url"
      @click="$emit('clicked', item)"
    >
      <v-list-item-avatar :size="16">
        <v-img v-if="item.icon" :src="item.icon" />
        <v-icon v-else-if="icon">mdi-file</v-icon>
      </v-list-item-avatar>
      <v-list-item-content :title="item.url" class="caption">
        <v-list-item-subtitle>
          <slot
            :item="item"
            name="content"
          >{{ item.title && item.title.length ? item.title : item.url }}</slot>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-list-item-action-text>
          <slot :item="item" name="action">
            <span v-if="item.date">{{ item.date.toLocaleDateString($t('locale'), timeOptions) }}</span>
          </slot>
        </v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>
<script>
import date from '@/mixins/date';

// @vue/component
export default {
  name: 'List',
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
