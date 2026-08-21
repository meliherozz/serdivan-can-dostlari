'use client';

import { useState } from 'react';

export function ReferenceCodePanel({ referenceCode }: { referenceCode: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(referenceCode);
    setCopied(true);
  };

  return (
    <div className="mt-7 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
      <p className="text-sm font-bold uppercase text-emerald-900">Başvuru Referans Numaranız</p>
      <p className="mt-3 break-all font-mono text-4xl font-black text-emerald-950">{referenceCode}</p>
      <button type="button" onClick={copy} className="btn-secondary focus-ring mt-5 px-4 py-2 text-sm">
        {copied ? 'Kopyalandı' : 'Referans Numarasını Kopyala'}
      </button>
    </div>
  );
}
