import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

import { FormFieldData } from './types';

interface FileUploadProps extends FormFieldData {
  mimeType?: string;
  className?: string;
  labelClassName?: string;
  elementClassName?: string;
  previewClassName?: string;
}

interface FileWithPreview extends File {
  preview: string;
}

const FileUpload = (props: FileUploadProps) => {
  const {
    id,
    className,
    labelClassName,
    elementClassName,
    previewClassName,
    type,
    label,
    mimeType
  } = props;
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
  // const inputClass = cx({ elementClassName, 'drag-active': isDragActive });

  return (
    <li className={className} {...getRootProps()} role="button" aria-label="File Upload">
      <label className={labelClassName} htmlFor={id}>
        {label}
      </label>
      <div className={elementClassName}>
        <input
          {...register(id)}
          {...getInputProps()}
          type={type}
          id={id}
          className={elementClassName}
        />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}

        {!!files?.length && (
          <div className={previewClassName}>
            {files.map((file: FileWithPreview) => {
              return (
                <div key={file.name}>
                  <img src={file.preview} alt={file.name} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </li>
  );
};

export default FileUpload;
