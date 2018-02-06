const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');

const plugins = [];
const devMode = process.env.NODE_ENV === 'development';
const prodMode = process.env.NODE_ENV === 'production';

const PROXY_HOST = process.env.PROXY_HOST;
const PROXY_PORT = process.env.PROXY_PORT;

if (prodMode) {
    plugins.push(new MinifyPlugin());
}

module.exports = {
    entry: ['babel-polyfill', './src/app/app.js'],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.js',
    },
    devtool: devMode && 'inline-sourcemap',
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    emitWarning: true,
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: ['babel-loader'],
            },
            {
                test: /\.global\.(scss)$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[local]',
                        },
                    }, 'sass-loader'],
                }),
            },
            {
                test: /\.(scss)$/,
                exclude: /\.global\.(scss)$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[hash:base64]-[name]-[local]',
                        },
                    }, 'sass-loader'],
                }),
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                }),
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss', '.css'],
        modules: ['node_modules'],
        alias: {
            i18n: path.resolve(__dirname, './src/i18n/'),
        },
    },
    plugins: [
        ...plugins,
        new CopyWebpackPlugin([
            'src/static/index.html',
        ]),
        new ExtractTextPlugin('styles.css', {
            allChunks: true,
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'build'),
        compress: true,
        port: 8080,
        proxy: {
            '/api': {
                target: `http://${PROXY_HOST}:${PROXY_PORT}`,
                pathRewrite: { '^/api': '' },
            },
        },
    },
};
