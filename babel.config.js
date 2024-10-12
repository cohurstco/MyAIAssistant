module.exports = function (/** @type {{ cache: (arg0: boolean) => void; }} */ api) {
  api.cache(true);

  const presets = [ "@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript" ];
  const plugins = [  ];

  if (process.env["ENV"] === "prod") {
    plugins.push();
  }

  return {
    presets,
    plugins
  };
}