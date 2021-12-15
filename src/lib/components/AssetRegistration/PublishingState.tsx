import React from 'react';
import { useAssetRegistration } from 'lib/contexts/AssetRegistrationProvider';

const PublishingState = () => {
  const { isPublishing, hasFinishedPublishing, hasPublishingError, publishingError } =
    useAssetRegistration();
  if (isPublishing) {
    return <h2>Publishing...</h2>;
  }

  if (hasFinishedPublishing) {
    if (hasPublishingError) {
      return <h2>{`Error: ${publishingError}`}</h2>;
    }
    return <h2>Publishing successful</h2>;
  }

  return <></>;
};

export default PublishingState;
