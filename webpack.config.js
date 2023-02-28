const path = require('path');

module.exports = {
  entry: ['./jsdist/kalendar.js', './jsdist/control.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
