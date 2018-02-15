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
        filename: 'app.js'
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
                    quiet: true,
                },
            },
            {
                test: /\.js$/,
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
                    }, 'resolve-url-loader', 'sass-loader?sourceMap'],
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
                    }, 'resolve-url-loader', 'sass-loader?sourceMap'],
                }),
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'],
                }),
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [ 'url-loader', 'img-loader' ]
            }
        ],
    },
    resolve: {
        symlinks: false,
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
        historyApiFallback: true,
        contentBase: path.join(__dirname, 'build'),
        compress: true,
        port: 8080,
        proxy: {
            '/api/v1': {
                target: `http://${PROXY_HOST}:${PROXY_PORT}`,
            },
        },
    },
};
