import React, { useEffect } from 'react';
import './scss/style.scss';
import mapFormDataToMetaData from 'lib/utils/mapFormDataToMetaData';

import { DDO } from '@nevermined-io/nevermined-sdk-js';
import { MetaDataFormDTO } from 'lib/contexts/forms/MetaDataFormProvider';
import { useNevermined } from 'lib/contexts/NeverminedProvider';
import { AssetRegistration, FormFieldData } from 'lib/components/AssetRegistration';
import { useAssetRegistration } from 'lib/contexts/AssetRegistrationProvider';

import { NuiTokenPrice } from 'lib/components/TokenPrice';
import { NuiTokenName } from 'lib/components/TokenName';
import Header from 'lib/components/Layout/Header';
import Footer from 'lib/components/Layout/Footer';
import Main from 'lib/components/Layout/Main';

import { ReactComponent as NeverminedWhiteLogo } from './lib/components/Layout/Logos/nevermined-logo-modifiable.svg';
import { ReactComponent as NeverminedLogo } from './lib/components/Layout/Logos/nevermined-logo.svg';
import { ReactComponent as KeykoLogo } from './lib/components/Layout/Logos/keyko-logo.svg';

function Example() {
  const { registerAsset, retrieveAssetDDO } = useAssetRegistration();

  const onSubmit = async (data: MetaDataFormDTO) => {
    const dataToSend = mapFormDataToMetaData('jochenname', data);
    console.log('mappedData', dataToSend);

    try {
      const res: DDO = await registerAsset(mapFormDataToMetaData('jochenname', data));
      console.log(res);
      const res2: DDO = await retrieveAssetDDO(res.id);
      console.log('res2', res2);
    } catch (e) {
      console.error('appsubmiterr', e);
    }
  };

  const onSubmitError = (data: any) => console.log('onSubmitError', data);

  const nvmContext = useNevermined();
  (window as any).nvm = nvmContext;
  useEffect(() => {
    const login = async () => {
      await nvmContext.connect();
      console.log('login nvmContext ye', nvmContext, nvmContext.user.balance);
    };
    login();
  }, [nvmContext]);

  const fields: FormFieldData[] = [
    { id: 'name', label: 'Asset Name', type: 'text' },
    { id: 'description', label: 'Asset Description:', type: 'textarea' },
    { id: 'testing', label: 'One thing:', type: 'textarea' },
    { id: 'something', label: 'Something:', type: 'textarea' }
  ];

  return (
    <>
      <Header>
        {/* Rinkeby test token */}
        <nav>
          <ul>
            <li>
              <NeverminedWhiteLogo width="48px" height="48px" fill="#ffffff" />
            </li>
            <li>
              <NuiTokenPrice address="0x022E292b44B5a146F2e8ee36Ff44D3dd863C915c">
                1234567890000000000
              </NuiTokenPrice>{' '}
              <NuiTokenName address="0x022E292b44B5a146F2e8ee36Ff44D3dd863C915c" />
            </li>
          </ul>
        </nav>
      </Header>
      <Main>
        <article>
          <section>
            <NeverminedLogo width="256px" height="256px" />
          </section>
          <section>
            <AssetRegistration
              onSubmit={onSubmit}
              onSubmitError={onSubmitError}
              detailFields={[
                { id: 'name', label: 'Asset Name', type: 'text' },
                { id: 'description', label: 'Asset Description:', type: 'textarea' },
                { id: 'testing', label: 'One thing:', type: 'textarea' },
                { id: 'something', label: 'Something:', type: 'textarea' }
              ]}
              authorshipFields={[
                { id: 'onething', label: 'One thing:', type: 'textarea' },
                { id: 'someimage', label: 'Some image:', type: 'file', mimeType: 'image/*' }
              ]}
              pricingFields={[{ id: 'anotherthing', label: 'Another thing:', type: 'textarea' }]}
            />
            {/* {!isLoggedIn && <div>not logged in</div>} */}
            {/* <button onClick={handleSubmit(onSubmit, onSubmitError)} type="button">
        Submit
      </button> */}
          </section>
        </article>
      </Main>
      <Footer>
        <nav>
          <ul>
            <li>
              <NeverminedWhiteLogo width="48px" height="48px" fill="#ffffff" />
            </li>
            <li>
              <KeykoLogo width="48px" height="48px" fill="#ffffff" />
            </li>
          </ul>
        </nav>
      </Footer>
    </>
  );
}

export default Example;
