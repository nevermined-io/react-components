import React from 'react';
import Catalog from 'hello-catalog';

const Example = (props: any) => {
  const ethProvider = Catalog.getEtheruemProvider();
  const { isAvailable: isEthAvailable } = Catalog.useWeb3Service(ethProvider);

  return (
    <>
      <div>Is Etheruem available: </div>
      <div>{String(isEthAvailable())}</div>
    </>
  );
};

export default Example;
