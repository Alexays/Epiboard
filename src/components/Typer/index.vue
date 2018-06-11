<template>
  <div id="typewriter">
    <template v-if="textField">
      <v-text-field ref="textInput" v-on:keyup.13="search" :value="typing" @input="userInput($event)" hide-details single-line :disabled="$route.path !== '/'"></v-text-field>
    </template>
    <a v-else :href="currentWord && $route.path === '/' ? `https://www.google.com/#q=${currentWord}` : null" target="_blank">
      <h1 :title="currentWord">
        <slot></slot>
        <span class="typewriter-msg" :class='{"typewriter-selected":isFullErasing}'>{{ typing }}</span>
        <span class="typewriter-cursor" v-if="cursor">{{ cursorSymbol }}</span>
      </h1>
    </a>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
