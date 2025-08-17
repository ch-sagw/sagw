'use client';

/**
 * useField hook for array fields only returns length of the array, but not
 * the array itself.
 * As workaround, we use useForm().getDataByPath()
 */

import {
  JSX, useState,
} from 'react';
import { InterfaceZenodoResponse } from '@/app/api/zenodo/verify/route';
import {
  useField, useForm,
} from '@payloadcms/ui';
import { reduceFieldsToValues } from 'payload/shared';

const ZenodoDocumentChooser = (): JSX.Element => {

  // hooks

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

  const formFields = useForm().fields;
  const formData = reduceFieldsToValues(formFields, true);

  // state

  const [
    id,
    setId,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

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
    } finally {
      setLoading(false);
    }
  };

  const onChangeInput = (val: string): void => {
    setId(val);
    setError(null);
    zenodoIdHook.setValue(undefined);
    publicationDateHook.setValue(undefined);
    titleHook.setValue(undefined);
    filesHook.setValue(undefined);
  };

  // render

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

      {!error && titleHook.value && zenodoIdHook.value && publicationDateHook.value &&
        <div>
          <p><strong>Title:</strong> {titleHook.value}</p>
          <p><strong>ID:</strong> {zenodoIdHook.value}</p>
          <p><strong>Publication Date:</strong> {publicationDateHook.value}</p>
          <div>
            <strong>Files:</strong>
            {formData.files && Array.isArray(formData.files) &&
              <ul>
                {formData.files.map((f, i) => (
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
    </div >
  );
};

export default ZenodoDocumentChooser;
