// @vue/component
export default {
  name: 'HtmlBlock',
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      padding: '5px',
      height: 'auto',
      html: '',
    };
  },
  created() {
    this.$emit('update:cardtitle', this.settings.cardName);

    if (this.settings.html) {
      this.html = this.settings.html;
    }

    this.padding = `${this.settings.padding}px`;
    if (this.settings.autoHeight) {
      this.height = 'auto';
    } else {
      this.height = `${this.settings.height}px`;
    }
  },
  methods: {
  },
};
