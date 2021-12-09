const mapFileUrlToPreview = (file: Blob | MediaSource) =>
  Object.assign(file, {
    preview: URL.createObjectURL(file)
  });

export default mapFileUrlToPreview;
