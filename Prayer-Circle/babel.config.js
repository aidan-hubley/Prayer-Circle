module.exports = function (api) {
  plugins: ["nativewind/babel"],
    api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
