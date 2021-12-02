import { Config, Nevermined, Account, MetaData } from '@nevermined-io/nevermined-sdk-js';
import MetaMaskProvider from '../contexts/wallets/MetaMaskProvider';
import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards'
import { ERRORS, BadGatewayAddressError } from '../errors/index';

const config = {
    metadataUri: 'http://localhost:5000',
    gatewayUri: 'http://localhost:8030',
    faucetUri: 'http://localhost:3001',
    nodeUri: `http://localhost:${process.env.ETH_PORT || 8545}`,
    parityUri: 'http://localhost:9545',
    secretStoreUri: 'http://localhost:12001',
    gatewayAddress: '0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0',
    verbose: true
} as Config


const connect = async () => {
    let metamaskProvider
    // if (isBurnerEnabled === 'true') {
    //     console.log(isBurnerEnabled)
    //     metamaskProvider = new BurnerWalletProvider()
    // } else {
    //     metamaskProvider = new MetamaskProvider()
    // }
    metamaskProvider = MetaMaskProvider;
    await metamaskProvider.startLogin()
    const accounts: string[] = await (metamaskProvider as any).web3?.eth.getAccounts()
    // setIsLogged(true)
    // setWeb3((metamaskProvider as any).web3)
    return new Account(accounts[0]);
}

// const connect = (sdk, state) => {
//     const res = sdk.logIn();
//     state.push(res);

// }

// MetaMaskPRovider {
//     constructor(sdk, state) {
//         this.sdk = sdk;
//         this. state = state;
//         this.login = () => connect(this.sdk, this.state);
//     }
// }

const initialize = async (): Promise<Account> => {
    const acc = await connect()
    console.log("Connected!")
    return acc;
    // setMessage('Successfully connected to Autonomies!')
}

export const getMetaData = async (did: string) => {
    // const id = did.getId();
    const account = await initialize();
    console.log(account)
    const sdk = await Nevermined.getInstance(config)
    const res = await sdk.metadata.retrieveDDO(did);
    console.log("getMetaData", res);
    return res;
}

const postMetaData = async (data: MetaData): Promise<any> => {

    try {
        const account = await initialize();
        console.log(account)
        const sdk = await Nevermined.getInstance(config)
        // const metadata = nevermined.metadata // eslint-disable-line prefer-destructuring


        let erc20TokenAddress = undefined;

        // const result: DDO = await sdk.assets.create(data, acc);
        const assetRewards = new AssetRewards(new Map([[account.getId(), Number(2)]]))
        const asset = await sdk.assets.create(
            data,
            account,
            // 1,
            // 0,
            // assetRewards,
            // 1,
            // erc20TokenAddress
        )
        console.log(asset)
        return asset;
    } catch (e: any) {
        if (e.code === 4001) {
            throw new ERRORS[4001](e.message);
        }
        if (e.message.startsWith("invalid address")) {
            throw new BadGatewayAddressError();
        }

    }
}
export { postMetaData }
