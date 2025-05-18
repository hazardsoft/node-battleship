import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
  const isDev = process.env.NODE_ENV === 'development';
  return {
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js',
      libraryTarget: 'module',
    },
    experiments: {
      outputModule: true,
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          include: [path.resolve(__dirname, 'src')],
          exclude: /node_modules/,
        },
      ],
    },
    target: 'node',
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'source-map' : false,
  };
};
