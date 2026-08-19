type SuccessPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const referenceCode = typeof params.referenceCode === 'string' ? params.referenceCode : 'Referans kodu bulunamadı';

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="rounded-lg border border-emerald-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-emerald-800">Başvurunuz Alındı</p>
        <h1 className="mt-3 text-3xl font-bold">Başvuru Numaranız</h1>
        <p className="mt-6 rounded-md bg-emerald-50 px-4 py-4 font-mono text-2xl font-bold text-emerald-900">{referenceCode}</p>
        <p className="mt-6 text-stone-600">Serdivan Belediyesi ilgili birimi başvurunuzu değerlendirecektir.</p>
      </div>
    </div>
  );
}
