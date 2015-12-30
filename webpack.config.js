var path = require('path');
var webpack = require('webpack');

var appRoot = path.join(__dirname, 'app');
var appModuleRoot = path.join(__dirname, 'app/components');
var bowerRoot = path.join(__dirname, 'bower_components');
var nodeRoot = path.join(__dirname, 'node_modules');

module.exports = {
    entry: 'app',
    output: {
        path: path.resolve('./app/assets'),
        filename: 'bundle.js',
        publicPath: '/assets/'
    },
    resolve: {
        root: [appRoot, nodeRoot, bowerRoot],
        modulesDirectories: [appModuleRoot],
        alias: {
            'angular-ui-tree': 'angular-ui-tree/dist/',
            'angular-date-range-picker': 'angular-date-range-picker/build/'
        },
        extensions: ['', '.js', '.coffee', '.html', '.css', '.scss']
    },
    resolveLoader: {
        root: nodeRoot
    },
    plugins: [
        new webpack.ProvidePlugin({
            _: 'lodash'
        }),
        new webpack.ResolverPlugin([
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ])
    ],
    module: {
        loaders: [
            {test: /\.coffee$/, loader: 'coffee'},
            {test: /\.html$/,   loader: 'html'},
            {test: /\.json$/,   loader: 'json'},
            {test: /\.css$/,    loader: 'style!css!autoprefixer'},
            {test: /\.scss$/,   loader: 'style!css!autoprefixer!sass'},
            {test: /\.woff$/,   loader: "url?limit=10000&minetype=application/font-woff"},
            {test: /\.ttf$/,    loader: "file"},
            {test: /\.eot$/,    loader: "file"},
            {test: /\.svg$/,    loader: "file"}
        ]
    }
};