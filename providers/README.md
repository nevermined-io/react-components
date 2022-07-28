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
