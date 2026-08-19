import { getShelterInfo } from '@/lib/strapi/client';

export default async function ShelterPage() {
  const shelter = await getShelterInfo().catch(() => null);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">{shelter?.name ?? 'Serdivan Belediyesi Sahipsiz Hayvanlar Bakımevi'}</h1>
      <p className="mt-4 leading-8 text-stone-700">
        {shelter?.description ?? 'Bakımevi bilgileri Strapi ShelterInfo içeriği oluşturulduktan sonra görüntülenecektir.'}
      </p>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-stone-200 bg-white p-5">
          <dt className="font-semibold">Adres</dt>
          <dd className="mt-2 text-stone-600">{shelter?.address ?? 'Placeholder'}</dd>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-5">
          <dt className="font-semibold">Telefon</dt>
          <dd className="mt-2 text-stone-600">{shelter?.phone ?? 'Placeholder'}</dd>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-5">
          <dt className="font-semibold">E-posta</dt>
          <dd className="mt-2 text-stone-600">{shelter?.email ?? 'Placeholder'}</dd>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-5">
          <dt className="font-semibold">Çalışma saatleri</dt>
          <dd className="mt-2 text-stone-600">{shelter?.workingHours ?? 'Placeholder'}</dd>
        </div>
      </dl>
    </div>
  );
}
