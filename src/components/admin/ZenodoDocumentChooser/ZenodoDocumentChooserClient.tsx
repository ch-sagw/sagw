'use client';

import {
  JSX, useEffect, useState,
} from 'react';

import { useField } from '@payloadcms/ui';

type Props = {
  verifyAction: (id: string) => Promise<{ ok: boolean; data?: any; error?: string }>;
};

const ZenodoDocumentChooserClient = ({
  verifyAction,
}: Props): JSX.Element => {
  const {
    value, setValue,
  } = useField<string>({
    path: 'zenodoDocumentChooser',
  });

  const [
    id,
    setId,
  ] = useState(value ?? '');
  const [
    loading,
    setLoading,
  ] = useState(false);
  const [
    verified,
    setVerified,
  ] = useState(false);
  const [
    error,
    setError,
  ] = useState<string | null>(null);
  const [
    result,
    setResult,
  ] = useState<any>(null);

  // When component mounts, make sure Save is disabled unless already verified
  useEffect(() => {
    if (value) {
      // If there’s a stored value in DB, treat it as verified
      setVerified(true);
      setId(value);
    } else {
      setVerified(false);
      setId('');
    }
  }, [value]);

  const onVerify = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setVerified(false);

    const res = await verifyAction(id);

    if (res.ok) {
      setVerified(true);
      setResult(res.data);

      // store verified ID in Payload field
      setValue(id);
    } else {
      setError(res.error ?? 'Unknown error');
      setResult(null);

      // ensures Save button stays disabled
      setValue(undefined);
    }

    setLoading(false);
  };

  const onChangeInput = (val: string): void => {
    setId(val);
    setVerified(false);
    setError(null);
    setResult(null);

    // clear Payload field until verified again
    setValue(undefined);
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-2 items-center'>
        <input
          type='text'
          value={id}
          disabled={verified}
          onChange={(e) => onChangeInput(e.target.value)}
          className='border rounded px-2 py-1'
          placeholder='Enter Zenodo ID'
        />
        <button
          type='button'
          onClick={onVerify}
          disabled={loading || !id || verified}
          className='px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50'
        >
          {loading
            ? 'Verifying...'
            : 'Verify'}
        </button>
      </div>

      {error && <div className='text-red-600'>{error}</div>}

      {verified && result && (
        <div className='p-2 border rounded bg-gray-50'>
          <p><strong>Title:</strong> {result.title}</p>
          <p><strong>Size:</strong> {result.size}</p>
        </div>
      )}
    </div>
  );
};

export default ZenodoDocumentChooserClient;
