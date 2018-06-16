<template>
  <div id="tasks">
    <v-list>
      <v-list-tile avatar v-for="task in tasks" :key="task.id">
        <v-list-tile-action>
          <v-checkbox v-model="task.status" value="completed"></v-checkbox>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-if="task.status === 'completed'"><strike>{{ task.title }}</strike></v-list-tile-title>
          <v-list-tile-title v-else>{{ task.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
