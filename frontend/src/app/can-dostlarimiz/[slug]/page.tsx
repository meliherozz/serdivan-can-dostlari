import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AnimalImage } from '@/components/AnimalImage';
import { getAnimalBySlug } from '@/lib/strapi/client';
import { ageLabels, genderLabels, sizeLabels, speciesLabels, statusLabels } from '@/utils/labels';

type AnimalDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AnimalDetailPage({ params }: AnimalDetailPageProps) {
  const { slug } = await params;
  const animal = await getAnimalBySlug(slug).catch(() => null);

  if (!animal) notFound();

  const facts = [
    ['Tür', speciesLabels[animal.species]],
    ['Cins', animal.breed?.name ?? 'Belirtilmemiş'],
    ['Cinsiyet', genderLabels[animal.gender]],
    ['Yaş', ageLabels[animal.ageGroup]],
    ['Boyut', sizeLabels[animal.size]],
    ['Durum', statusLabels[animal.adoptionStatus]],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
          <AnimalImage animal={animal} large />
        </div>
        <section>
          <p className="text-sm font-semibold text-emerald-800">{statusLabels[animal.adoptionStatus]}</p>
          <h1 className="mt-2 text-4xl font-bold">{animal.name}</h1>
          <p className="mt-4 text-lg leading-8 text-stone-600">{animal.shortDescription}</p>
          <dl className="mt-6 grid grid-cols-2 gap-3">
            {facts.map(([label, value]) => (
              <div key={label} className="rounded-md border border-stone-200 bg-white p-3">
                <dt className="text-xs font-semibold uppercase tracking-normal text-stone-500">{label}</dt>
                <dd className="mt-1 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          {animal.adoptionStatus === 'available' ? (
            <Link href={`/sahiplen/${animal.slug}`} className="mt-6 inline-flex w-full justify-center rounded-md bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800 sm:w-auto">
              Sahiplenmek İstiyorum
            </Link>
          ) : (
            <p className="mt-6 rounded-md bg-stone-100 px-4 py-3 text-sm font-medium text-stone-700">
              Bu hayvan için şu anda yeni başvuru alınamıyor.
            </p>
          )}
        </section>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="text-2xl font-bold">Hakkında</h2>
          <p className="mt-3 whitespace-pre-line leading-8 text-stone-700">{animal.description}</p>
          <h2 className="mt-8 text-2xl font-bold">Karakter</h2>
          <p className="mt-3 leading-8 text-stone-700">{animal.personality}</p>
        </section>
        <aside className="rounded-lg border border-stone-200 bg-white p-5">
          <h2 className="text-xl font-bold">Sağlık Durumu</h2>
          <ul className="mt-4 space-y-3 text-sm text-stone-700">
            <li>Aşı: {animal.vaccinated ? 'Tamamlandı' : 'Bilgi bekleniyor'}</li>
            <li>Kısırlaştırma: {animal.neutered ? 'Tamamlandı' : 'Tamamlanmadı'}</li>
            <li>Mikroçip: {animal.microchipped ? 'Var' : 'Yok / bilgi bekleniyor'}</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
