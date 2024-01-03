module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.es',
          '.es6',
          '.mjs',
          '.jpg',
          '.png',
        ],
        root: ['./'],
        alias: {
          app: './app',
          assets: './assets',
          '@abong.code': './abong.code',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
