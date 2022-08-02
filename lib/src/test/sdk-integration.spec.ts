import { ethers } from 'ethers';
import { initializeNevermined } from '../nevermined';

export const serviceUri = 'https://autonomies-backend.autonomies.staging.nevermined.rocks';
export const metadataUri = 'https://metadata.autonomies.staging.nevermined.rocks'; // 'http://localhost:5000'
export const gatewayAddress = '0xe63a11dC61b117D9c2B1Ac8021d4cffEd8EC213b';
export const gatewayUri = 'https://gateway.autonomies.pre.nevermined.rocks';
export const faucetUri = 'https://faucet.autonomies.staging.nevermined.rocks';
export const marketplaceUri = 'https://marketplace-api.autonomies.pre.nevermined.rocks';
const nodeUri = 'https://polygon-mumbai.infura.io/v3/eda048626e2745b182f43de61ac70be1';

const config = {
  web3Provider:
    typeof window !== 'undefined'
      ? //@ts-ignore
        window?.ethereum
      : new ethers.providers.JsonRpcProvider(nodeUri),
  gatewayUri,
  faucetUri,
  verbose: true,
  gatewayAddress,
  marketplaceAuthToken: '',
  marketplaceUri,
  artifactsFolder: `../../public/contracts`
};

test('initialize sdk successfully', async () => {
  const response = await initializeNevermined(config);
  console.log(response);
  expect(true).toEqual(true);
});
