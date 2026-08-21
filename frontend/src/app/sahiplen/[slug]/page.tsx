import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdoptionForm } from '@/components/AdoptionForm';
import { StatusBadge } from '@/components/StatusBadge';
import { getAnimalBySlug } from '@/lib/strapi/client';
import { ageLabels, genderLabels, sizeLabels, speciesLabels } from '@/utils/labels';

type AdoptionPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdoptionPage({ params }: AdoptionPageProps) {
  const { slug } = await params;
  const animal = await getAnimalBySlug(slug).catch(() => null);

  if (!animal) notFound();

  const meta = [speciesLabels[animal.species], genderLabels[animal.gender], ageLabels[animal.ageGroup], `${sizeLabels[animal.size]} Boy`].join(' · ');

  return (
    <div>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-soft)]">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <p className="text-sm font-bold uppercase text-[var(--color-primary)]">Sahiplendirme Başvurusu</p>
          <div className="mt-3 flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-white p-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold text-[var(--color-muted)]">Başvuru yapılan can dostu</p>
              <h1 className="mt-1 text-4xl font-black text-[var(--color-text)]">{animal.name}</h1>
              <p className="mt-2 text-sm font-bold text-[var(--color-muted)]">{meta}</p>
            </div>
            <StatusBadge status={animal.adoptionStatus} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-8">
        {animal.adoptionStatus === 'available' ? (
          <AdoptionForm animal={animal} />
        ) : (
          <div className="rounded-lg border border-[var(--color-border)] bg-white p-6 text-[var(--color-muted)]">
            <p className="font-bold text-[var(--color-text)]">Bu can dostu için şu anda yeni başvuru alınamıyor.</p>
            <Link href={`/can-dostlarimiz/${animal.slug}`} className="btn-secondary focus-ring mt-4 px-4 py-2 text-sm">
              Detay sayfasına dön
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
