# Nevermined React Library

This projects aims to provide generic React components that
connect and communicate with Nevermined.

Steps to integrate:

#### 1:
```typescript
yarn add @nevermined-io/components-catalog
```

#### 2:
```typescript
import Catalog from '@nevermined-io/components-catalog';
import { appConfig } from './config';
import App from 'app';

ReactDOM.render(
  <div>
    <Catalog.NeverminedProvider config={appConfig}>
      <App />
    </Catalog.NeverminedProvider>
  </div>,
  document.getElementById('root') as HTMLElement
);
```

** you can find config example inside [examples](https://github.com/nevermined-io/components-catalog/blob/main/example/src/config.ts) folder in this repo.

After finishing these two steps you have two different ways to utilise the package:

1) use core functions exposed through the context, for example: 
```typescript
    const { asset } = useContext(Catalog.NeverminedContext);
    const result = await asset.resolve();
```

2) use hooks exported from services folder.

for more details and example https://github.com/nevermined-io/components-catalog/tree/main/lib#plug-and-play-services
