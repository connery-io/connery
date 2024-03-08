export default `const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    target: 'node',
    optimization: {
        minimize: true,
    },
    output: {
        filename: 'plugin.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs2',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
};
`;
