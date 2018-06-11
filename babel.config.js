module.exports = {
  presets: [
    ["@babel/preset-env", {
      "modules": false
    }],
    ["@babel/preset-stage-2", {
      decoratorsLegacy: true
    }]
  ],
  plugins: ["transform-vue-jsx", "@babel/plugin-transform-runtime"],
}
