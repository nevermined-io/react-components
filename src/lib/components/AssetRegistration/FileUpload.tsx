import React, { ReactNode, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

import mapFileUrlToPreview from '../../utils/mapFileUrlToPreview';
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
    mimeType = 'image/*',
    onDrop,
    DragActiveComponent = <p>Drop the files here ...</p>,
    DragInactiveComponent = <p>Drag 'n' drop some files here, or click to select files</p>
  }: FileUploadProps) => {
    const {
      register,
      setValue,
      getValues,
      formState: { isSubmitting, isSubmitted }
    } = useFormContext();

    const prevFiles = getValues(id) || [];
    const [files, setFiles] = useState<FileWithPreview[]>(prevFiles);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: mimeType,
      onDrop: (acceptedFiles) => {
        files?.forEach((file: FileWithPreview): void => {
          URL.revokeObjectURL(file.preview);
        });
        setValue(id, acceptedFiles.map(mapFileUrlToPreview));
        setFiles(getValues(id));
        if (onDrop) onDrop();
      }
    });

    useEffect(() => {
      // * revoke object urls of preview images when going back while submitting!
      if (isSubmitting) {
        files?.forEach((file: FileWithPreview): void => {
          URL.revokeObjectURL(file.preview);
        });
        if (files) setFiles([]);
      }
    }, [isSubmitting]);

    useEffect(() => {
      // * revoke object urls of preview images after submit!
      if (isSubmitted) {
        files?.forEach((file: FileWithPreview): void => {
          URL.revokeObjectURL(file.preview);
        });
        if (files) setFiles([]);
      }
    }, [isSubmitted]);

    return (
      <div {...getRootProps()} className={elementClassName}>
        <input
          {...register(id)}
          {...getInputProps()}
          type={type}
          id={id}
          className={`${elementClassName}input`}
        />

        {!files?.length && (isDragActive ? DragActiveComponent : DragInactiveComponent)}

        {!!files?.length && mimeType?.startsWith('image') && (
          <div className={previewClassName}>
            {files.map((file: FileWithPreview) => {
              return (
                <picture key={file.name}>
                  <img src={file.preview} alt={file.name} />
                </picture>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

export default FileUpload;
