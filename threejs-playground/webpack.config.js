var path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: 'build',
        filename: 'bundle.js'
    },
    node: {
        fs: 'empty'
    },
    loaders: [
        {
            test: /\.json$/,
            loader: 'json'
        }
    ],
    postLoaders: [
    ],
    plugins: []
};
