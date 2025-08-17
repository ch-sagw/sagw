'use client';

/**
 * useField hook for array fields only returns length of the array, but not
 * the array itself.
 * As workaround, we use useForm().getDataByPath()
 */

import {
  JSX, useEffect, useState,
} from 'react';
import {
  InterfaceZenodoData, InterfaceZenodoResponse,
} from '@/app/api/zenodo/verify/route';
import {
  useField, useForm,
} from '@payloadcms/ui';

const ZenodoDocumentChooser = (): JSX.Element => {

  // hooks

  const formHook = useForm();

  const zenodoIdHook = useField<string>({
    path: 'zenodoId',
  });

  const titleHook = useField<string>({
    path: 'title',
  });
  const publicationDateHook = useField<string>({
    path: 'publicationDate',
  });
  const filesHook = useField<any[]>({
    path: 'files',
  });

  // state

  const [
    id,
    setId,
  ] = useState('');

  const [
    valueFromPayload,
    setValueFromPayload,
  ] = useState<InterfaceZenodoData | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  // effects

  useEffect(() => {
    if (zenodoIdHook.value && publicationDateHook.value && titleHook.value && filesHook.value) {
      setValueFromPayload({
        date: publicationDateHook.value,
        files: formHook.getDataByPath('files'),
        id: zenodoIdHook.value,
        title: titleHook.value,
      });
    }
  }, [
    zenodoIdHook.value,
    publicationDateHook.value,
    titleHook.value,
    filesHook.value,
    formHook,
  ]);

  // methods

  const onVerify = async (): Promise<void> => {
    if (!id) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/zenodo/verify?id=${id}`);
      const data: InterfaceZenodoResponse = await res.json();

      if (data.ok && data.data) {
        zenodoIdHook.setValue(data.data.id);
        publicationDateHook.setValue(data.data.date);
        titleHook.setValue(data.data.title);
        filesHook.setValue(data.data.files);
      } else {
        setError(data.error ?? 'Unknown error');
        zenodoIdHook.setValue(undefined);
        publicationDateHook.setValue(undefined);
        titleHook.setValue(undefined);
        filesHook.setValue(undefined);
      }

    } catch (err: unknown) {
      const message = err instanceof Error
        ? err.message
        : 'Unknown error';

      setError(message);
      setValueFromPayload(null);

    } finally {
      setLoading(false);
    }
  };

  const onChangeInput = (val: string): void => {
    setId(val);
    setError(null);
    setValueFromPayload(null);
  };

  return (
    <div>
      <div>
        <input
          type='text'
          value={id}
          onChange={(e) => onChangeInput(e.target.value)}
          placeholder='Enter Zenodo ID'
        />
        <button
          type='button'
          onClick={onVerify}
          disabled={loading}
        >
          {loading
            ? 'Verifying...'
            : 'Verify'}
        </button>
      </div>

      {error && <div>Error: {error}</div>}

      {!error && valueFromPayload &&
        <div>
          <p><strong>Title:</strong> {valueFromPayload.title}</p>
          <p><strong>ID:</strong> {valueFromPayload.id}</p>
          <p><strong>Publication Date:</strong> {valueFromPayload.date || 'N/A'}</p>
          <div>
            <strong>Files:</strong>
            {valueFromPayload.files &&
              <ul>
                {valueFromPayload.files.map((f, i) => (
                  <li key={i}>
                    <a href={f.link} target='_blank'
                      rel='noreferrer'>{f.link}</a>{' '}
                    ({f.format}, {f.size ?? 'N/A'} MB)
                  </li>
                ))}
              </ul>
            }
          </div>
        </div>
      }
    </div>
  );
};

export default ZenodoDocumentChooser;
