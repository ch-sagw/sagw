'use client';

import {
  JSX, useEffect, useState,
} from 'react';
import {
  InterfaceZenodoData, InterfaceZenodoResponse,
} from '@/app/api/zenodo/verify/route';
import { useField } from '@payloadcms/ui';

const ZenodoDocumentChooserClient = (): JSX.Element => {

  // hooks

  const useFieldHook = useField<InterfaceZenodoData | undefined>({
    path: 'zenodoDocumentChooser',
  });

  const apiResponse = useFieldHook.value;
  const setApiResponse = useFieldHook.setValue;

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
    if (apiResponse) {
      setValueFromPayload(apiResponse);
    }
  }, [apiResponse]);

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
        setApiResponse(data.data);
      } else {
        setError(data.error ?? 'Unknown error');
        setApiResponse(undefined);
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

      {!error && valueFromPayload && valueFromPayload.files?.length > 0 &&
        <div>
          <p><strong>Title:</strong> {valueFromPayload.title}</p>
          <p><strong>ID:</strong> {valueFromPayload.id}</p>
          <div>
            <strong>Files:</strong>
            <ul>
              {valueFromPayload.files.map((f, i) => (
                <li key={i}>
                  <a href={f.link} target='_blank' rel='noreferrer'>{f.link}</a>{' '}
                  ({f.format}, {f.size ?? 'N/A'} MB)
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
    </div>
  );
};

export default ZenodoDocumentChooserClient;
