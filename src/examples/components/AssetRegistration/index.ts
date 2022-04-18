/**
 * @module AssetRegistration
 * @example
 * ```tsx
 *import React from 'react';
 *import AssetRegistration from 'lib/components/AssetRegistration/AssetRegistration';
 *
 *const AssetRegistrationExample = ({ onSubmit, onSubmitError }) => {
 *  return (
 *    <section>
 *      <AssetRegistration
 *        onSubmit={onSubmit}
 *        onSubmitError={onSubmitError}
 *        detailFields={[
 *          { id: 'name', label: 'Asset Name', type: 'text' },
 *          { id: 'description', label: 'Asset Description:', type: 'textarea' },
 *          { id: 'testing', label: 'One thing:', type: 'textarea' },
 *          { id: 'something', label: 'Something:', type: 'textarea' }
 *        ]}
 *        authorshipFields={[
 *          { id: 'onething', label: 'One thing:', type: 'textarea' },
 *          { id: 'someimage', label: 'Some image:', type: 'file', mimeType: 'image/*' }
 *        ]}
 *        pricingFields={[{ id: 'anotherthing', label: 'Another thing:', type: 'textarea' }]}
 *      />
 *    </section>
 *  );
 *};
 * ```

 */

export * from './types';

export { default as RegistrationStep } from './RegistrationStep';
export { default as FileUpload } from './FileUpload';
export { default as AssetRegistration } from './AssetRegistration';
export { default as FormField } from './FormField';
