import mapFileUrlToPreview from 'lib/utils/mapFileUrlToPreview';
import useRefState from 'lib/utils/useRefState';
import React, { ReactNode, useState, useRef, useEffect } from 'react';
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
  DragActiveComponent?: ReactNode | string;
  DragInactiveComponent?: ReactNode | string;
}

export interface FileWithPreview extends File {
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
    DragActiveComponent = <p>Drop the files here ...</p>,
    DragInactiveComponent = <p>Drag 'n' drop some files here, or click to select files</p>
  }: FileUploadProps) => {
    const {
      register,
      setValue,
      getValues,
      formState: { isSubmitting }
    } = useFormContext();
    const test = register(`${id}-previewvalues`);
    const prevFiles = getValues(id);
    const [files, setFiles] = useState<FileWithPreview[]>(prevFiles);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: mimeType || 'image/*',
      onDrop: (acceptedFiles) => {
        setValue(id, acceptedFiles.map(mapFileUrlToPreview));
        setFiles(getValues(id));
        if (onDrop) onDrop();
      }
    });

    useEffect(() => {
      if (isSubmitting) {
        console.log('bro', files);
        files?.forEach((file: FileWithPreview): void => {
          URL.revokeObjectURL(file.preview);
        });
        if (files) setFiles([]);
      }
    }, [isSubmitting, files]);

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
            className={`${elementClassName}input`}
          />

          {!files?.length && (isDragActive ? DragActiveComponent : DragInactiveComponent)}

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
