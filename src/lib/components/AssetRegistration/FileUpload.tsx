import mapFileUrlToPreview from 'lib/utils/mapFileUrlToPreview';
import React, { ReactNode, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

import { FormFieldData } from './types';

interface FileUploadProps extends FormFieldData {
  mimeType?: string;
  className?: string;
  labelClassName?: string;
  elementClassName?: string;
  previewClassName?: string;
  onDrop?(): void;
  dragActiveComponent?: ReactNode | string;
  dragInactiveComponent?: ReactNode | string;
}

interface FileWithPreview extends File {
  preview: string;
}

const FileUpload = React.memo(
  ({
    id,
    className,
    labelClassName,
    elementClassName,
    previewClassName,
    type,
    label,
    mimeType,
    onDrop,
    dragActiveComponent = <p>Drop the files here ...</p>,
    dragInactiveComponent = <p>Drag 'n' drop some files here, or click to select files</p>
  }: FileUploadProps) => {
    const { register, setValue, getValues } = useFormContext();
    const prevFiles = getValues(id);
    const [files, setFiles] = useState(prevFiles);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: mimeType || 'image/*',
      onDrop: (acceptedFiles) => {
        setValue(id, acceptedFiles.map(mapFileUrlToPreview));
        setFiles(getValues(id));
        if (onDrop) onDrop();
      }
    });

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
          {isDragActive ? dragActiveComponent : dragInactiveComponent}

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
  }
);

export default FileUpload;
