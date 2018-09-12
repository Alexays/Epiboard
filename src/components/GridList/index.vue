<template>
  <div class="grid-list">
    <li v-for="node in data" :key="node.name" class="node">
      <div :title="node.name" @click="$emit('clicked', node)">
        <i :style="{ 'background-image': `url(${node.icon})` }"/>
      </div>
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
