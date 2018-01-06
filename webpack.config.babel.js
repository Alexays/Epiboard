import fs from 'fs';
import WebPack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';

const srcDir = 'src';
const isProduction = process.env.NODE_ENV === 'production';
const components = [];

fs.readdirSync('./src/components', { encoding: 'utf8' }).forEach((file) => {
    if (file !== 'App') {
        components.push(file);
    }
});

module.exports = {
    entry: `./${srcDir}/app/index.js`,
    output: {
        path: __dirname + '/dist',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            '@': `./${srcDir}/`
        }
    },
    module: {
        rules: [
            {
                test: /\.s?css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: isProduction
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [
                                    require('autoprefixer')({
                                        browsers: '> 5%'
                                    })
                                ]
                            }
                        },
                        'sass-loader'
                    ]
                })
            },
            {
                test: /\.vue/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader?presets[]=es2015'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader?hash=sha512&digest=hex&name=img/[hash].[ext]'
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            gifsicle: {
                                interlaced: true
                            },
                            mozjpeg: {
                                quality: 65
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            svgo: {
                                plugins: [
                                    {
                                        removeViewBox: false
                                    },
                                    {
                                        removeEmptyAttrs: false
                                    }
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader?name=fonts/[hash].[ext]'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css'
        }),
        // new HtmlWebpackPlugin({
        //     filename: 'index.html',
        //     inject: true,
        //     template: `${srcDir}/index.html`
        // }),
        // new ScriptExtHtmlWebpackPlugin({
        //     async: /bundle\.([0-9a-zA-Z])+\.js/
        // }),
        new WebPack.optimize.UglifyJsPlugin({
            minimize: isProduction,
            compress: {
                warnings: false
            },
        }),
        new WebPack.LoaderOptionsPlugin({
            minimize: true
        }),
        new WebPack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            vars: JSON.stringify({
                components
            })
        }),
    ]
};
