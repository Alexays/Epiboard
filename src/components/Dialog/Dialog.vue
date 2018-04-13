<template>
  <v-dialog v-model="active" persistent max-width="290">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>{{ text }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" flat="flat" @click="close()">{{ cancel }}</v-btn>
        <v-btn color="green darken-1" flat="flat" @click="valid()">{{ ok }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data() {
      return {
        active: false,
        titie: '',
        text: '',
        ok: 'Ok',
        cancel: 'Cancel',
        resolve: null,
      };
    },
    methods: {
      show(options = {}) {
        return new Promise((resolve) => {
          if (this.active) {
            this.close();
            this.$nextTick(() => this.show(options));
            return;
          }
          this.resolve = resolve;
          const keys = Object.keys(options);
          for (let i = 0; i < keys.length; i += 1) {
            this[keys[i]] = options[keys[i]];
          }
          this.active = true;
        });
      },
      valid() {
        this.active = false;
        this.resolve(true);
      },
      close() {
        this.active = false;
        this.resolve(false);
      },
      dismiss() {
        if (this.dismissible) {
          this.active = false;
        }
      },
    },
  };

</script>
