import React from 'react';
import { NuiQueryAssets } from './components/QueryAssets';
import { DDO } from '@nevermined-io/nevermined-sdk-js';

const QueryAssetExample = () => {
  return (
    <section className="query-assets">
      <NuiQueryAssets>
        {(assets, info, goNext, goPrev) => {
          return (
            <>
              {JSON.stringify(info, null, 2)}
              <ul>
                {assets.map((ddo: DDO) => {
                  const {
                    id,
                    service: [metadata, ...rest]
                  } = ddo;
                  const {
                    attributes: {
                      additionalInformation: { description }
                    }
                  } = metadata;

                  return (
                    <li key={id}>
                      <ul>
                        <li>
                          <label>ID:</label>
                          <span>{id}</span>
                        </li>
                        <li>
                          <label>Description:</label>
                          <span>{description}</span>
                        </li>
                      </ul>
                    </li>
                  );
                })}

                {info.canGoPrev && (
                  <li>
                    <button onClick={goPrev}> Prev </button>
                  </li>
                )}
                {info.canGoNext && (
                  <li>
                    <button onClick={goNext}> Next </button>
                  </li>
                )}
              </ul>
            </>
          );
        }}
      </NuiQueryAssets>
    </section>
  );
};

export default QueryAssetExample;
