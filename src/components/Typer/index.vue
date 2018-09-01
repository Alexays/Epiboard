<template>
  <div id="typewriter">
    <template v-if="textField">
      <v-text-field
        ref="textInput"
        :value="capitalized"
        :disabled="$route.path !== '/'"
        :spellcheck="!typeInterval"
        hide-details single-line
        class="pt-0" @keyup.13="search" @focus="stop" @input="userInput"/>
    </template>
    <a v-else :href="url" target="_blank">
      <h1 :title="currentWord" dir="auto">
        <slot/>
        <span :class="{ 'typewriter-selected': isFullErasing }" class="typewriter-msg">
          {{ typing }}
        </span>
        <span v-if="cursor" class="typewriter-cursor">{{ cursorSymbol }}</span>
      </h1>
    </a>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
