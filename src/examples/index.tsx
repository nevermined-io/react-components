import React, { useState } from 'react';
import mapFormDataToMetaData from 'lib/utils/mapFormDataToMetaData';

import { DDO } from '@nevermined-io/nevermined-sdk-js';
import { MetaDataFormDTO } from 'lib/contexts/forms/MetaDataFormProvider';
import { useNevermined } from 'lib/contexts/NeverminedProvider';
import { useAssetManager } from 'lib/contexts/AssetRegistrationProvider';
import { useAccountManager } from 'lib/contexts/AccountProvider';

import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Main from './components/Layout/Main';

import { NeverminedLogo } from './components/Layout/Logos/Logo';
import { KeykoLogo } from './components/Layout/Logos/KeykoLogo';
import QueryAssetExample from './QueryAssetExample';
import AssetRegistrationExample from './AssetRegistrationExample';
import TokenExample from './TokenExample';

function Example(props: any) {
  const { registerAsset } = useAssetManager();
  const { address, isLoggedIn } = useAccountManager();
  const [currentPage, setCurrentPage] = useState(0);
  const onSubmit = async (data: MetaDataFormDTO) => {
    //const dataToSend = mapFormDataToMetaData('jochenname', data);

    try {
      const res: DDO = await registerAsset(mapFormDataToMetaData('jochenname', data));
      console.log('result', res);
      // const res2: DDO = await retrieveAssetDDO(res.id);
      // console.log('res2', res2);
    } catch (e) {
      console.error('onSubmit error', e);
    }
  };

  const onSubmitError = (data: any) => console.log('onSubmitError', data);

  const nvmContext = useNevermined();
  (window as any).nvm = nvmContext;

  //const fields: FormFieldData[] = [
  //{ id: 'name', label: 'Asset Name', type: 'text' },
  //{ id: 'description', label: 'Asset Description:', type: 'textarea' },
  //{ id: 'testing', label: 'One thing:', type: 'textarea' },
  //{ id: 'something', label: 'Something:', type: 'textarea' }
  //];

  return (
    <>
      <Header>
        {/* Rinkeby test token */}
        <nav>
          <ul>
            <li>
              <NeverminedLogo width={48} height={48} color="#ffffff" />
            </li>
            <li style={{ color: isLoggedIn() ? 'green' : 'red' }}>
              {isLoggedIn() ? 'connected' : 'disconnected'}
            </li>
          </ul>
        </nav>
        <div>
          <li style={{ color: 'white' }}>{address}</li>
        </div>
      </Header>
      <Main>
        <article>
          <nav>
            <ul>
              <li onClick={() => setCurrentPage(0)}>Asset Registration</li>
              <li onClick={() => setCurrentPage(1)}>Query Assets</li>
              <li onClick={() => setCurrentPage(2)}>Token Components</li>
            </ul>
          </nav>
          {currentPage === 0 && (
            <AssetRegistrationExample onSubmit={onSubmit} onSubmitError={onSubmitError} />
          )}
          {currentPage === 1 && <QueryAssetExample />}
          {currentPage === 2 && <TokenExample />}
        </article>
      </Main>
      <Footer>
        <nav>
          <ul>
            <li>
              <NeverminedLogo width={48} height={48} color="#ffffff" />
            </li>
            <li>
              <KeykoLogo size={48} color="#ffffff" />
            </li>
          </ul>
        </nav>
      </Footer>
    </>
  );
}

export default Example;

//<NuiTokenPrice address="0x022E292b44B5a146F2e8ee36Ff44D3dd863C915c">
//1234567890000000000
//</NuiTokenPrice>{' '}
//<NuiTokenName address="0x022E292b44B5a146F2e8ee36Ff44D3dd863C915c" />
