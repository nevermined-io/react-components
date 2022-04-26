import React from 'react';
//import { useNevermined, UseAccountAddressManager, UseAccountLogInManager } from 'test-catalog';
import Catalog from 'hello-catalog';
//import Main from './components/Layout/Main';
//import QueryAssetExample from './QueryAssetExample';
//import ExampleHeader from './components/Header';
//import { useAccountsChangedListener } from 'lib/hooks/UseWeb3Manager';

const Example = (props: any) => {
  const addressManagerState = Catalog.useAccountManager.useAccountAddressManager();
  console.log('addressManagerState', addressManagerState);
  //const accountState = Catalog.useAccountManager.useAccountLogInManager();
  const { web3Manager } = Catalog.useNevermined();
  console.log('web3Manager', web3Manager);
  React.useEffect(() => {
    const isAvailable = web3Manager.isAvailable();
    console.log('isAvailable', isAvailable);
  }, [web3Manager]);
  //const { updateAddress, address } = UseAccountAddressManager();
  //const { isLoggedIn } = UseAccountLogInManager(web3Manager, address);
  //useAccountsChangedListener((accounts: string[]) => updateAddress(accounts[0] || ''));

  return (
    <>
      <div>hello</div>
      {/*<ExampleHeader address={address} isLoggedIn={isLoggedIn} web3Manager={web3Manager} />
      <Main>
        <QueryAssetExample />
      </Main>*/}
    </>
  );
};

export default Example;

//const fields: FormFieldData[] = [
//{ id: 'name', label: 'Asset Name', type: 'text' },
//{ id: 'description', label: 'Asset Description:', type: 'textarea' },
//{ id: 'testing', label: 'One thing:', type: 'textarea' },
//{ id: 'something', label: 'Something:', type: 'textarea' }
//];

//const onSubmit = async (data: MetaDataFormDTO, registerAsset: any) => {
////const dataToSend = mapFormDataToMetaData('jochenname', data);
//try {
//const res: DDO = await registerAsset(mapFormDataToMetaData('jochenname', data));
//console.log('result', res);
//// const res2: DDO = await retrieveAssetDDO(res.id);
//} catch (e) {
//console.error('onSubmit error', e);
//}
//};
//
//const onSubmitError = (data: any) => console.log('onSubmitError', data);
