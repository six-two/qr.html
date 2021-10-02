const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const path = require('path')

module.exports = {
    entry: __dirname + '/src/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index.js',
    },
    mode: "development",
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve('src/index.html'),
        }),
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime/, /index.js/])
    ],
    module: {
        rules: [{
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
        }, ],
    },
}