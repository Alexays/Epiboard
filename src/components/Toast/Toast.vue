<template>
  <v-snackbar
    :timeout="timeout"
    :color="color"
    :top="true"
    :right="true"
    v-model="active"
    @click="dismiss">
    <v-icon
      dark
      left
      v-if="icon.length > 0">
      {{ icon }}
    </v-icon>
    <span>{{text}}</span>
    <v-btn v-if="dismissible" flat @click="dismiss">Close</v-btn>
  </v-snackbar>
</template>
<script>
import VSnackbar from 'vuetify/es5/components/VSnackbar';

export default {
  components: {
    VSnackbar,
  },
  data() {
    return {
      active: false,
      text: '',
      icon: '',
      color: 'info',
      timeout: 3000,
      dismissible: true,
    };
  },
  methods: {
    show(options = {}) {
      if (this.active) {
        this.close();
        this.$nextTick(() => this.show(options));
        return;
      }
      const keys = Object.keys(options);
      for (let i = 0; i < keys.length; i += 1) {
        this[keys[i]] = options[keys[i]];
      }
      this.active = true;
    },
    close() {
      this.active = false;
    },
    dismiss() {
      if (this.dismissible) {
        this.active = false;
      }
    },
  },
};
</script>
