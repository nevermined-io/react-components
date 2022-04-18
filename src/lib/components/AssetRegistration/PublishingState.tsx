import React from 'react';

const PublishingState = () => {
  // FIXME
  const { isPublishing, hasFinishedPublishing, hasPublishingError, publishingError } = {
    isPublishing: false,
    hasFinishedPublishing: false,
    hasPublishingError: false,
    publishingError: undefined 
  };
  if (isPublishing) {
    return <h2>Publishing...</h2>;
  }

  if (hasFinishedPublishing) {
    if (hasPublishingError) {
      console.error('has publishing error', publishingError);
      return <h2>{`Error: ${publishingError}`}</h2>;
    }
    return <h2 id="successMessage">Publishing successful</h2>;
  }

  return <></>;
};

export default PublishingState;
