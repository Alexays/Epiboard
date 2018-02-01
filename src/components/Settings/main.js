import Config from '@/components/Config';
import Settings from '@/settings';
import flow from 'lodash/fp/flow';
import groupBy from 'lodash/fp/groupBy';
import map from 'lodash/fp/map';

export default {
  name: 'Settings',
  components: {
    Config,
  },
  data() {
    return {
      settings: Settings,
    };
  },
  methods: {},
  mounted() {
    chrome.storage.sync.get('settings_global', (data) => {
      this.settings = flow(
        groupBy('name'),
        map(values => [{}].concat(values).reduce((a, x) => Object.assign(a, x))),
      )([...this.settings, ...((data || {}).settings_global || [])]);
    });
  },
};
