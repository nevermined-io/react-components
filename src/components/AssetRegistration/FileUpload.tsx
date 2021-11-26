import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import cx from 'classnames';
import { MetaDataFormDTO } from '../../utils/mapFormDataToMetaData';
import { FormFieldProps } from './FormField';

interface FileUploadProps extends FormFieldProps {
  mimeType?: string;
}

interface FileWithPreview extends File {
  preview: string;
}
const FileUpload = (props: FileUploadProps) => {
  const { id, className, type, label, mimeType } = props;
  const { register, setValue, getValues } = useFormContext();
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: mimeType || 'image/*',
    onDrop: (acceptedFiles) => {
      setValue(
        id,
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
      setFiles(getValues(id));
    }
  });

  return (
    <>
      <div className={className} {...getRootProps()} role="button" aria-label="File Upload">
        <label htmlFor={id}>{label}</label>
        <input {...register(id)} {...getInputProps()} type={type} id={id} />
        <div className={' ' + (isDragActive ? ' ' : ' ')}>
          {isDragActive ? (
            <p style={{ backgroundColor: 'white' }}>Drop the files here ...</p>
          ) : (
            <p style={{ backgroundColor: 'white' }}>
              Drag 'n' drop some files here, or click to select files
            </p>
          )}

          {!!files?.length && (
            <div className=" ">
              {files.map((file: any) => {
                return (
                  <div key={file.name}>
                    <img
                      src={file.preview}
                      alt={file.name}
                      style={{
                        height: '200px'
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FileUpload;
