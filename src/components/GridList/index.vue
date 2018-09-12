<template>
  <div class="grid-list">
    <li v-for="node in data" :key="node.name" class="node">
      <a
        :href="node.url"
        :title="node.name"
        :style="{ 'background-image': `url(${node.icon})` }" @click="$emit('clicked', node)"/>
    </li>
  </div>
</template>
<script>
// @vue/component
export default {
  name: 'GridList',
  components: {
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
};
</script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
