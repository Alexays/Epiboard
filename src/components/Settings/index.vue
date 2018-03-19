<template>
  <div id="settings">
    <v-content>
      <v-container fluid>
        <v-card class="container">
          <h4 class="headline">Dark mode</h4>
          <v-layout row>
            <v-flex class="dark-p">
              <v-switch :label="`On`" v-model="dark"></v-switch>
            </v-flex>
            <v-flex class="dark-p">
              <v-checkbox :label="`Auto`" :disabled="!dark" v-model="dark_auto"></v-checkbox>
            </v-flex>
            <v-flex>
              <v-menu ref="from_menu" :disabled="!dark_auto" lazy :close-on-content-click="false" v-model="from_menu" transition="scale-transition" offset-y full-width
                :nudge-right="40" max-width="290px" min-width="290px" :return-value.sync="from">
                <v-text-field :disabled="!dark_auto" slot="activator" label="from" v-model="from" prepend-icon="access_time" readonly></v-text-field>
                <v-time-picker format="24h" v-model="from" @change="$refs.from_menu.save(from)"></v-time-picker>
              </v-menu>
            </v-flex>
            <v-flex>
              <v-menu ref="to_menu" :disabled="!dark_auto" lazy :close-on-content-click="false" v-model="to_menu" transition="scale-transition" offset-y full-width
                :nudge-right="40" max-width="290px" min-width="290px" :return-value.sync="to">
                <v-text-field :disabled="!dark_auto" slot="activator" label="to" v-model="to" prepend-icon="access_time" readonly></v-text-field>
                <v-time-picker format="24h" v-model="to" @change="$refs.to_menu.save(to)"></v-time-picker>
              </v-menu>
            </v-flex>
          </v-layout>
          <Config @save="save()" :settings="settings" id="global" />
          <p class="text-xs-right">Made with
            <v-icon small color="red">favorite</v-icon> by
            <a href="https://arouillard.fr">Alexis Rouillard</a>
          </p>
        </v-card>
      </v-container>
    </v-content>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
