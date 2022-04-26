# Preqrequisites

1. have `yarn` installed
2. have `nvm` installed (or node version 14)
3. use node version 14: `nvm use`
4. install packages: `yarn`.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\

### `yarn test:e2e`

Start integration tests.

### `yarn build`

Builds the library. It uses a custom webpack config found under `webpack.config.js`

This config is only used for building the `PACKAGE`, not for dev mode.

### Documentation

Documentation uses [typedoc](https://github.com/TypeStrong/typedoc) under the hood.

To generate documentation:

`yarn docs:generate`.

To view documentation:

`yarn docs:serve`

Utility command to do both:

`yarn docs:dev`


Documentation is currently not hosted or committed to git.

## Components

To see the components in action, start the server. The [Example](/src/Example.tsx) contains a small app showcasing all the components. Please make sure to add new component examples to the example when you add new ones.
