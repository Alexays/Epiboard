const files = require.context('./', true, /^\.\/\w+\/index\.vue$/);
const keys = files.keys();
const modules = {};
for (let i = 0; i < keys.length; i += 1) {
  const tmp = files(keys[i]).default;
  if (tmp && tmp.name) {
    modules[tmp.name] = tmp;
  }
}
export default modules;
