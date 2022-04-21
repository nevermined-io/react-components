import { promptSwitchAccounts } from 'lib';
import React from 'react';
import Header from './Layout/Header';
import NeverminedLogo from './Layout/Logos/Logo';

const ExampleHeader = (props: any) => {
  const { isLoggedIn, web3Manager, address } = props;

  return (
    <Header>
      <nav>
        <ul>
          <li>
            <NeverminedLogo width={48} height={48} color="#ffffff" />
          </li>
          <li style={{ color: isLoggedIn ? 'green' : 'red' }}>
            {isLoggedIn ? (
              <>
                <div>Connected!</div>
                <div style={{ cursor: 'pointer' }} onClick={promptSwitchAccounts}>
                  Switch Account!
                </div>
              </>
            ) : (
              <div onClick={web3Manager.startLogin} style={{ cursor: 'pointer' }}>
                connect
              </div>
            )}
          </li>
        </ul>
      </nav>
      <div>
        <li style={{ color: 'white' }}>{address}</li>
      </div>
    </Header>
  );
};

export default ExampleHeader;
