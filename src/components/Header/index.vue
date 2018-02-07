<template>
  <header tag="header" class="grey">
    <progressive-background no-ratio :src="background">
        <a :href="current.length > 0 ? 'https://www.google.com/#q=' + current : null" v-show="$route.path === '/'">
            <vue-typer tag="h1" :text="messages" pre-erase-delay='5000' erase-delay='250' :shuffle='true'
                @erased='addTrends' @typed='onTyped'></vue-typer>
        </a>
      <vue-typer v-if="$route.path !== '/'" tag="h1" :text="$route.name" :repeat='0'></vue-typer>
    </progressive-background>
    <v-btn v-if="$route.path === '/settings'" id="settings" flat icon color="white" to="/">
      <v-icon x-large>arrow_back</v-icon>
    </v-btn>
    <v-btn v-show="$route.path !== '/settings'" id="settings" flat icon color="white" to="/settings">
      <v-icon>more_vert</v-icon>
    </v-btn>
  </header>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
