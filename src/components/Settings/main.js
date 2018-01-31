import Config from '@/components/Config';
import Settings from './settings';

export default {
  name: 'Settings',
  props: ['settings'],
  components: {
    Config,
  },
  data() {
    return {
      settings: [],
    };
  },
  methods: {},
  mounted() {
    this.settings = Settings;
  },
};
