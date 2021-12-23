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

## Components

To see the components in action, start the server. The [Example](/src/Example.tsx) contains a small app showcasing all the components. Please make sure to add new components to the example.

### [AssetRegistration](/src/lib/components/AssetRegistration/AssetRegistration.tsx)

This component provides automated generation of form fields for the MetaData API.

It needs to be wrapped in a [AssetRegistrationProvider](/src/lib/contexts/AssetRegistrationProvider.tsx) and a [MetaDataFormProvider](/src/lib/contexts/forms/MetaDataFormProvider.tsx) to work.

It can be given a classname. This classname will generate the subclass names of the form field components.

### Token Components

TBD.

### QueryAssets

TBD.

## Contexts

TBD

### Registering an asset

TBD

#### MetaDataFormProvider

TBD

#### AssetRegistrationProvider

TBD

## Services

TBD
