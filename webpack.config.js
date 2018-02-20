const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');

const plugins = [];
const devMode = process.env.NODE_ENV === 'development';
const prodMode = process.env.NODE_ENV === 'production';


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
            { test: /\.js$/, loader: "babel-loader" },
            {
                test: /\.global\.(scss)$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[local]'
                        }
                    }, 'sass-loader']
                })
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
                            localIdentName: '[hash:base64]-[name]-[local]'
                        }
                    }, 'sass-loader']
                })
            },
            {
                test: /\.css$/,
                include: /node_modules/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                })
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [ 'url-loader', 'img-loader' ]
            }
        ],
    },
    resolve: {
        symlinks: prodMode,
        extensions: ['.js', '.jsx', '.scss'],
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
};
