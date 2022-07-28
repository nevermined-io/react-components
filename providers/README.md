# Nevermined Providers Library

#### 1.
```typescript
yarn add @nevermined-io/catalog-providers
or
npm install --save @nevermined-io/catalog-providers
```

#### 2.
```typescript
import { MetaMask } from "@nevermined-io/catalog-providers";
import App from "app";
import { chainConfig, nodeUri, correctNetworkId }  from "./config";
import { Config } from "@nevermined-io/nevermined-sdk-js";

const appConfig: Config = {
    nodeUri,
};

ReactDOM.render(
    <div>
        <MetaMask.WalletProvider
            chainConfig={chainConfig}
            correctNetworkId={correctNetworkId}
            nodeUri={String(appConfig.nodeUri)}
        >
            <App />
        </MetaMask.WalletProvider>
    </div>,
    document.getElementById("root") as HTMLElement
);
```

#### 3.
```typescript
import { MetaMask } from "@nevermined-io/catalog-providers";

const MMWallet = () => {
  const { loginMetamask, walletAddress } = MetaMask.useWallet();
  return (
    <>
      <div> {walletAddress}</div>
      {!walletAddress && <button onClick={loginMetamask}>Connect To MM</button>}
    </>
  );
};
```
