import React from 'react';
import { useNevermined } from 'lib/contexts/NeverminedProvider';
import Main from './components/Layout/Main';
import QueryAssetExample from './QueryAssetExample';
import ExampleHeader from './components/Header';
import { useAccountAddressManager, useAccountLogInManager } from 'lib/hooks/UseAccountManager';
import { useAccountsChangedListener } from 'lib/hooks/UseWeb3Manager';

const Example = (props: any) => {
  const { web3Manager } = useNevermined();
  const { updateAddress, address } = useAccountAddressManager();
  const { isLoggedIn } = useAccountLogInManager(web3Manager, address);
  useAccountsChangedListener((accounts: string[]) => updateAddress(accounts[0] || ''));

  return (
    <>
      <ExampleHeader address={address} isLoggedIn={isLoggedIn} web3Manager={web3Manager} />
      <Main>
        <QueryAssetExample />
      </Main>
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
