<template>
  <div class="grid-list">
    <li v-for="node in data" :key="node.name" class="node">
      <a
        :href="node.url"
        :title="node.name"
        :style="{
          'background-image': `url(${node.icon})`,
          width: `${size}px`, height: `${size}px`,
        }"
        @click="$emit('clicked', node)"/>
    </li>
  </div>
</template>
<script>
// @vue/component
export default {
  name: 'GridList',
  props: {
    data: {
      type: Array,
      required: true,
    },
    size: {
      type: Number,
      default: 128,
    },
  },
};
</script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
