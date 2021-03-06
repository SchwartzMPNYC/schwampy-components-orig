const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// this lets me access the dev server from my phone more easily
const os = require('os');
const ipAddressOfLocalMachine = Object.values(os.networkInterfaces())[1][0]
	.address;

module.exports = {
	mode: 'development',
	entry: {
		app: './src/index.ts',
		button: './src/components/Button/Button.component.ts',
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
		host: ipAddressOfLocalMachine,
		port: '2651',
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({ title: 'Schwampy Components' }),
		new MiniCssExtractPlugin({
			moduleFilename: ({ name }) =>
				`${name.replace('/ts/', '/css/')}.css`,
		}),
	],
	resolve: {
		extensions: ['.ts', '.js', '.json'],
	},
	module: {
		rules: [
			{ test: /\.ts$/, use: ['ts-loader'], exclude: /node_modules/ },
			{
				test: /\.scss$/i,
				issuer: [{ test: /\.ts$/i }],
				issuer: { not: [/component\.ts$/i] },
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: /\.scss$/i,
				issuer: [{ test: /component\.ts$/i }],
				use: [
					{
						loader: 'url-loader',
						options: {
							mimetype: 'text/css',
						},
					},
					'sass-loader',
				],
			},
			{
				test: /\.html$/i,
				loader: 'html-loader',
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				loader: 'file-loader',
			},
		],
	},
};
