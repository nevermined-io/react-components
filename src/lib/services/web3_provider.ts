import Web3 from 'web3';

const initWeb3 = (): Web3 => {
  const provider = window?.ethereum
    ? window.ethereum
    : //@ts-ignore
    window?.web3
    ? //@ts-ignore
      window.web3.currentProvider
    : //@ts-ignore
      Web3.providers.HttpProvider(nodeUri); // default provider
  const web3 = new Web3(provider);

  return web3;
};

const listeners = {};

export default initWeb3;
