const files = require.context('../cards', true, /^\.\/\w+\/index\.vue$/);
const modules = {};
files.keys().forEach((key) => {
  const moduleName = key.replace(/(\.\/|\.js)/g, '');
  modules[moduleName.substring(0, moduleName.lastIndexOf('/'))] = files(key).default;
});
export default modules;
