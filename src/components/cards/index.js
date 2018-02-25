const files = require.context('./', true, /^\.\/\w+\/index\.vue$/);
const modules = {};
files.keys().forEach((key) => {
  const moduleName = key.replace(/(\.\/|\.js)/g, '');
  if (files(key).default) {
    modules[moduleName.substring(0, moduleName.lastIndexOf('/'))] = files(key).default;
  }
});
export default modules;
