/* config-overrides.js */
const path = require('path');
const webpack = require('webpack');
module.exports = function override(config, env) {
    //do stuff with the webpack config...

    config.resolve.fallback = {
        url: require.resolve('url'),
        assert: require.resolve('assert'),
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        stream: require.resolve('stream-browserify'),
        fs: false,
        // os: require.resolve('os-browserify/browser'),
        // buffer: require.resolve('buffer'),
    };
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser.js',
            Buffer: ['buffer', 'Buffer'],
        })
    );
    config.module.rules.push({
        test: /\.js$/,
        include: path.resolve(__dirname, './node_modules/circomlib'),
        use: ['babel-loader'],
    });
    config.module.rules.push({
        test: /\.cjs$/,
        include: [
            path.resolve(__dirname, './node_modules/ffjavascript'),
            path.resolve(__dirname, './node_modules/@nevermined-io/nevermined-sdk-js/node_modules/ffjavascript'),
            path.resolve(__dirname, './node_modules/circomlib/node_modules/ffjavascript'),
        ],
        use: ['babel-loader'],
        type: 'javascript/auto',
    });

    return config;
};
