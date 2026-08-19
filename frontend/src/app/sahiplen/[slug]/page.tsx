import { notFound } from 'next/navigation';
import { AdoptionForm } from '@/components/AdoptionForm';
import { getAnimalBySlug } from '@/lib/strapi/client';

type AdoptionPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdoptionPage({ params }: AdoptionPageProps) {
  const { slug } = await params;
  const animal = await getAnimalBySlug(slug).catch(() => null);

  if (!animal) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-sm font-semibold text-emerald-900">Başvuru yapılan hayvan</p>
        <h1 className="mt-1 text-3xl font-bold text-emerald-950">{animal.name}</h1>
      </div>
      {animal.adoptionStatus === 'available' ? (
        <AdoptionForm animal={animal} />
      ) : (
        <div className="rounded-lg border border-stone-200 bg-white p-6 text-stone-700">
          Bu hayvan için şu anda yeni başvuru alınamıyor.
        </div>
      )}
    </div>
  );
}
