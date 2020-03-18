<template>
  <div id="html-block">
    <div v-if="html.length" v-html="html" :style="{ height: height, padding: padding }"></div>
    <v-card-text v-else>
      <div class="text-xs-center">
        <h2 v-t="'HtmlBlock.empty'" class="subheading"/>
      </div>
    </v-card-text>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
