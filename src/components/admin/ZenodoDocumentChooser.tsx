'use client';

import {
  JSX, useState,
} from 'react';
import { InterfaceZenodoResponse } from '@/app/api/zenodo/verify/route';
import {
  useAllFormFields, useForm,
} from '@payloadcms/ui';
import { reduceFieldsToValues } from 'payload/shared';

const ZenodoDocumentChooser = (): JSX.Element => {

  // hooks

  const [
    formFields,
    dispatchFormFields,
  ] = useAllFormFields();

  const formData = reduceFieldsToValues(formFields, true);
  const formHook = useForm();

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

  const dispatchEmptyFields = (): void => {
    dispatchFormFields({
      path: 'zenodoId',
      type: 'REMOVE',
    });

    dispatchFormFields({
      path: 'publicationDate',
      type: 'REMOVE',
    });

    dispatchFormFields({
      path: 'title',
      type: 'REMOVE',
    });

    if (formData.files && Array.isArray(formData.files)) {
      formData.files.forEach(() => {
        dispatchFormFields({
          path: 'files',
          rowIndex: 0,
          type: 'REMOVE_ROW',
        });
      });
    }
  };

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

        dispatchFormFields({
          path: 'zenodoId',
          type: 'UPDATE',
          value: data.data.id,
        });

        dispatchFormFields({
          path: 'publicationDate',
          type: 'UPDATE',
          value: data.data.date,
        });

        dispatchFormFields({
          path: 'title',
          type: 'UPDATE',
          value: data.data.title,
        });

        dispatchFormFields({
          path: 'files',
          type: 'UPDATE',
          value: data.data.files,
        });

        formHook.setIsValid(true);
        formHook.setDisabled(false);
        formHook.setModified(true);

      } else {
        setError(data.error ?? 'Unknown error');

        dispatchEmptyFields();
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

    dispatchEmptyFields();
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

      {!error && formData.title && formData.zenodoId && formData.publicationDate &&
        <div>
          <p><strong>Title:</strong> {formData.title}</p>
          <p><strong>ID:</strong> {formData.zenodoId}</p>
          <p><strong>Publication Date:</strong> {formData.publicationDate}</p>
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
