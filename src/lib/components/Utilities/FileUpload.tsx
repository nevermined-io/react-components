import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import defaultStyles from './FileUpload.module.scss';

const FileUpload = ({
  styles = defaultStyles,
  onDrop = (e: any) => console.log('change'),
  multiple = true
}) => {
  //   const onDrop = useCallback((acceptedFiles) => {
  //     console.log(acceptedFiles);
  //   }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple });

  return (
    <div className={styles.root} {...getRootProps()}>
      <input {...getInputProps()} />
      {/* {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )} */}
    </div>
  );
};

export default FileUpload;
