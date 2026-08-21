import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AnimalGallery } from '@/components/AnimalGallery';
import { StatusBadge } from '@/components/StatusBadge';
import { getAnimalBySlug } from '@/lib/strapi/client';
import { ageLabels, genderLabels, sizeLabels, speciesLabels, statusLabels } from '@/utils/labels';

type AnimalDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const ctaText = {
  reserved: 'Bu can dostu şu anda rezerve',
  adopted: 'Bu can dostumuz yuvasına kavuştu',
  unavailable: 'Şu anda yeni başvuru alınamıyor',
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
    ['Boyut', `${sizeLabels[animal.size]} Boy`],
  ];

  const healthItems = [
    ['Aşı', animal.vaccinated ? 'Aşıları yapıldı' : 'Aşı bilgisi bulunmuyor'],
    ['Kısırlaştırma', animal.neutered ? 'Kısırlaştırıldı' : 'Kısırlaştırma bilgisi bulunmuyor'],
    ['Mikroçip', animal.microchipped ? 'Mikroçipli' : 'Mikroçip bilgisi bulunmuyor'],
  ];

  return (
    <div>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-soft)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-14">
          <AnimalGallery animal={animal} />

          <div>
            <StatusBadge status={animal.adoptionStatus} />
            <h1 className="mt-4 text-5xl font-black leading-tight text-[var(--color-text)] md:text-6xl">{animal.name}</h1>
            <p className="mt-5 text-lg leading-8 text-[var(--color-muted)]">
              {animal.shortDescription || 'Bu can dostumuz hakkında temel bilgileri aşağıda inceleyebilirsiniz.'}
            </p>

            <dl className="mt-7 grid grid-cols-2 gap-3">
              {facts.map(([label, value]) => (
                <div key={label} className="rounded-lg border border-[var(--color-border)] bg-white/85 p-4">
                  <dt className="text-xs font-bold uppercase text-[var(--color-muted)]">{label}</dt>
                  <dd className="mt-1 font-black text-[var(--color-text)]">{value}</dd>
                </div>
              ))}
            </dl>

            {animal.adoptionStatus === 'available' ? (
              <Link href={`/sahiplen/${animal.slug}`} className="btn-primary focus-ring mt-7 w-full px-5 py-3 sm:w-auto">
                Sahiplenmek İstiyorum <span className="arrow-shift" aria-hidden="true">→</span>
              </Link>
            ) : (
              <p className="mt-7 rounded-lg border border-[var(--color-border)] bg-white px-5 py-4 text-sm font-bold text-[var(--color-text)]">
                {ctaText[animal.adoptionStatus as keyof typeof ctaText] ?? statusLabels[animal.adoptionStatus]}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_340px]">
        <div>
          <article className="rounded-lg border border-[var(--color-border)] bg-white p-6">
            <p className="text-sm font-bold uppercase text-[var(--color-primary)]">{animal.name}&apos;ın Hikâyesi</p>
            <p className="mt-4 whitespace-pre-line text-lg leading-8 text-[var(--color-muted)]">
              {animal.description || 'Detaylı açıklama bulunmuyor.'}
            </p>
          </article>

          <article className="mt-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-primary-soft)] p-6">
            <p className="text-sm font-bold uppercase text-[var(--color-primary)]">Karakteri</p>
            <p className="mt-4 whitespace-pre-line text-lg leading-8 text-[var(--color-muted)]">
              {animal.personality || 'Karakter bilgisi bulunmuyor.'}
            </p>
          </article>
        </div>

        <aside className="rounded-lg border border-[var(--color-border)] bg-white p-6 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-2xl font-black text-[var(--color-text)]">Sağlık Bilgileri</h2>
          <ul className="mt-5 space-y-3 text-sm text-[var(--color-muted)]">
            {healthItems.map(([label, value]) => (
              <li key={label} className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
                <span className="block text-xs font-bold uppercase text-[var(--color-muted)]">{label}</span>
                <span className="mt-1 block font-bold text-[var(--color-text)]">{value}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}
