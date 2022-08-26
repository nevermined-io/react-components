import { generateTestingUtils } from 'eth-testing';
import { initializeNevermined } from '../src/nevermined';
import { appConfig } from "./config";

export const serviceUri = 'https://autonomies-backend.autonomies.staging.nevermined.rocks';
export const metadataUri = 'https://metadata.autonomies.staging.nevermined.rocks'; // 'http://localhost:5000'
export const gatewayAddress = '0xe63a11dC61b117D9c2B1Ac8021d4cffEd8EC213b';
export const gatewayUri = 'https://gateway.autonomies.pre.nevermined.rocks';
export const faucetUri = 'https://faucet.autonomies.staging.nevermined.rocks';
export const marketplaceUri = 'https://marketplace-api.autonomies.pre.nevermined.rocks';

const config = { artifactsFolder: './artifacts', ...appConfig }

const testingUtils = generateTestingUtils({ providerType: 'MetaMask' });
testingUtils.mockConnectedWallet(['0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf'], {
  chainId: 80001
});

describe('SDK Integration', () => {
  afterEach(() => {
    testingUtils.clearAllMocks();
  });

  it('initialize sdk successfully', async () => {
    appConfig.web3Provider = testingUtils.getProvider();
    const response = await initializeNevermined(config);
    expect(response.success).toEqual(true);
  });
});
