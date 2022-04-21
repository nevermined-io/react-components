/**
 *
 * @param file Blob or Mediasource
 * @returns 
 */
const mapFileUrlToPreview = (file: Blob | MediaSource) =>
  Object.assign(file, {
    preview: URL.createObjectURL(file)
  });

export default mapFileUrlToPreview;
