import React, { ReactNode } from 'react';
import { fireEvent, render, act } from '@testing-library/react';
import MetaDataFormProvider from 'lib/contexts/forms/MetaDataFormProvider';
import FileUpload from './FileUpload';

const renderWithProvider = (comp: ReactNode, rest?: any) => {
  return render(<MetaDataFormProvider>{comp}</MetaDataFormProvider>, rest);
};

const mockImmediate = (cb: any) => setTimeout(cb, 0);

const mockData = (files: any) => {
  return {
    dataTransfer: {
      files,
      items: files.map((file: any) => ({
        kind: 'file',
        type: file.type,
        getAsFile: () => file
      })),
      types: ['Files']
    }
  };
};

const flushPromises = (ui: any, container: any) => {
  return new Promise((resolve) =>
    mockImmediate(() => {
      renderWithProvider(ui, { container });
      resolve(container);
    })
  );
};

const dispatchEvt = (node: any, type: string, data: any) => {
  const event = new Event(type, { bubbles: true });
  Object.assign(event, data);
  fireEvent(node, event);
};

describe('FileUpload', () => {
  test('invoke onDragEnter when dragenter event occurs', async () => {
    const file = new File([JSON.stringify({ ping: true })], 'ping.json', {
      type: 'application/json'
    });
    const data = mockData([file]);
    const handleOnDrop = jest.fn();

    await act(async () => {
      const ui = <FileUpload type="file" id="file-upload" label="label" onDrop={handleOnDrop} />;
      const { container } = renderWithProvider(ui);

      // drop a file
      const dropzone = container.querySelector('input[type="file"]');
      dispatchEvt(dropzone, 'dragenter', data);
      dispatchEvt(dropzone, 'dragover', data);
      dispatchEvt(dropzone, 'drop', data);
      await flushPromises(ui, container);
    });

    expect(handleOnDrop).toHaveBeenCalled();
  });
});
