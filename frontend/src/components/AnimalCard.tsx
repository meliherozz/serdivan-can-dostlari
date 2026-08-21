import Link from 'next/link';
import type { Animal } from '@/types/domain';
import { ageLabels, genderLabels, sizeLabels, speciesLabels } from '@/utils/labels';
import { AnimalImage } from './AnimalImage';
import { StatusBadge } from './StatusBadge';

type Props = {
  animal: Animal;
};

export function AnimalCard({ animal }: Props) {
  const speciesGender = [speciesLabels[animal.species], genderLabels[animal.gender]];
  const ageSize = [ageLabels[animal.ageGroup], sizeLabels[animal.size]];

  return (
    <article className="group interactive-card flex h-full flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
      <div className="h-56 shrink-0 overflow-hidden">
        <AnimalImage animal={animal} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="min-h-[5.75rem]">
          <div className="flex items-start justify-between gap-3">
            <h3 className="min-w-0 text-2xl font-black text-[var(--color-text)]">{animal.name}</h3>
            <StatusBadge status={animal.adoptionStatus} />
          </div>
          <div className="mt-1 space-y-0.5">
            <p className="flex flex-wrap gap-x-1 text-sm font-semibold text-[var(--color-muted)]">
              <span className="whitespace-nowrap">{speciesGender[0]}</span>
              <span aria-hidden="true">·</span>
              <span className="whitespace-nowrap">{speciesGender[1]}</span>
            </p>
            <p className="flex flex-wrap gap-x-1 text-sm font-medium text-[var(--color-muted)]">
              <span className="whitespace-nowrap">{ageSize[0]}</span>
              <span aria-hidden="true">·</span>
              <span className="whitespace-nowrap">{ageSize[1]}</span>
            </p>
          </div>
        </div>

        <p className="mt-4 min-h-[4.5rem] line-clamp-3 text-sm leading-6 text-[var(--color-muted)]">
          {animal.shortDescription || animal.description || 'Bu can dostumuzun detaylarını profil sayfasında inceleyebilirsiniz.'}
        </p>

        <Link href={`/can-dostlarimiz/${animal.slug}`} className="btn-primary focus-ring mt-auto w-full px-4 py-2.5 text-sm">
          Detayları Gör <span className="arrow-shift" aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
