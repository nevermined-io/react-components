import { Config, Nevermined, DID, DDO, Account } from '@nevermined-io/nevermined-sdk-js';
import MetaMaskProvider from '../providers/MetaMaskProvider';
import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards'

const config = {
    metadataUri: 'http://localhost:5000',
    gatewayUri: 'http://localhost:8030',
    faucetUri: 'http://localhost:3001',
    nodeUri: `http://localhost:${process.env.ETH_PORT || 8545}`,
    parityUri: 'http://localhost:9545',
    secretStoreUri: 'http://localhost:12001',
    verbose: true
} as Config


const loginMetamask = async () => {
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

const initialize = async (): Promise<Account> => {
    const acc = await loginMetamask()
    console.log("Connected!")
    return acc;
    // setMessage('Successfully connected to Autonomies!')
}

const postMetaData = async (data: any) => {

    try {
        const account = await initialize();
        console.log(account)
        const sdk = await Nevermined.getInstance(config)
        // const metadata = nevermined.metadata // eslint-disable-line prefer-destructuring
        const did: DID = DID.generate()
        const ddo: DDO = new DDO({
            id: did.getId(),
            // attributes: {}
        })

        let erc20TokenAddress = undefined;

        // const result: DDO = await sdk.assets.create(data, acc);
        const assetRewards = new AssetRewards(new Map([[account.getId(), Number(2)]]))
        const asset = await sdk.nfts.create(
            data,
            account,
            1,
            0,
            assetRewards,
            1,
            erc20TokenAddress
        )
        console.log(asset)
    } catch (e) {
        console.error(e);
    }
}
export { postMetaData }
