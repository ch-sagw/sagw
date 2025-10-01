'use client';

import {
  JSX, useState, useTransition,
} from 'react';
import {
  useAllFormFields, useForm,
} from '@payloadcms/ui';
import { reduceFieldsToValues } from 'payload/shared';
import {
  InterfaceZenodoResponse, verifyZenodo,
} from '@/app/actions/zenodo';
import { useTenantSelection } from '@payloadcms/plugin-multi-tenant/client';

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
    startTransition,
  ] = useTransition();

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    idAlreadyExists,
    setIdAlreadyExists,
  ] = useState(false);

  const tenant = useTenantSelection().selectedTenantID;

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

  const onVerify = (): void => {
    if (!id) {
      return;
    }

    if (!tenant) {
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        // check for existing id
        const zenodoResponse = await fetch(`/api/zenodoDocuments?where[tenant][equals]=${tenant}&where[zenodoId][equals]=${id}`);
        const responseJson = await zenodoResponse.json();

        if (responseJson.docs?.length > 0) {
          setIdAlreadyExists(true);

          return;
        }

        setIdAlreadyExists(false);

        // get zenodo data
        const data: InterfaceZenodoResponse = await verifyZenodo(id);

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
        // setLoading(false);
      }
    });
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
          data-testid='zenodo-input'
        />
        <button
          type='button'
          onClick={onVerify}
          disabled={loading}
          data-testid='zenodo-button'
        >
          {loading
            ? 'Verifying...'
            : 'Verify'}
        </button>
      </div>

      {idAlreadyExists && <div data-testid='id-already-there'>ID already exists in your collection.</div>}

      {error && <div>Error: {error}</div>}

      {!error && formData.title && formData.zenodoId && formData.publicationDate &&
        <div>
          <p><strong>Title:</strong> {formData.title}</p>
          <p><strong>ID:</strong> {formData.zenodoId}</p>
          <p><strong>Publication Date:</strong> {formData.publicationDate}</p>
          <div>
            <strong>Files:</strong>
            {formData.files && Array.isArray(formData.files) &&
              <ul data-testid='zenodo-list'>
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
