<template>
  <header tag="header" class="grey">
    <div class="background" v-if="background">
      <img v-lazy="background" />
    </div>
    <template v-if="$store.state.settings.global.header_design === 'full'">
      <a :href="typer.current.length > 0 ? 'https://www.google.com/#q=' + typer.current : null" v-show="$route.path === '/'">
        <vue-typer tag="h1" :text="messages" pre-erase-delay='5000' erase-delay='250'
        :shuffle='true' :repeat='messages.length === 1 ? 0 : Infinity' @erased='addTrends' @typed='onTyped'></vue-typer>
      </a>
      <vue-typer v-if="$route.path !== '/'" tag="h1" :text="$route.name" :repeat='0'></vue-typer>
      <v-btn v-if="$route.path === '/settings'" id="settings" flat icon color="white" to="/">
        <v-icon x-large>arrow_back</v-icon>
      </v-btn>
      <v-btn v-show="$route.path !== '/settings'" id="settings" flat icon color="white" to="/settings">
        <v-icon>more_vert</v-icon>
      </v-btn>
    </template>
    <v-toolbar v-else card absolute prominent>
      <v-text-field v-on:keyup.native="search" :prepend-icon-cb="search" prepend-icon="search" :value="$route.path === '/' ? typer.part : $route.name"
      @input="typer.typed = $event" hide-details single-line :readonly="$route.path !== '/'"></v-text-field>
      <v-spacer></v-spacer>
      <v-btn title="Go to settings" v-show="$route.path !== '/settings'" to="/settings" icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
      <v-btn title="Back to home" v-if="$route.path === '/settings'" to="/" icon>
        <v-icon>arrow_back</v-icon>
      </v-btn>
    </v-toolbar>
  </header>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
