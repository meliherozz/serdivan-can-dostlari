import Link from 'next/link';
import type { Animal } from '@/types/domain';
import { ageLabels, genderLabels, speciesLabels, statusLabels } from '@/utils/labels';
import { AnimalImage } from './AnimalImage';

type Props = {
  animal: Animal;
};

export function AnimalCard({ animal }: Props) {
  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <div className="aspect-[4/3] overflow-hidden">
        <AnimalImage animal={animal} />
      </div>
      <div className="space-y-4 p-4">
        <div>
          <h3 className="text-xl font-bold text-stone-950">{animal.name}</h3>
          <p className="mt-1 text-sm text-stone-600">{animal.shortDescription}</p>
        </div>
        <dl className="grid grid-cols-2 gap-2 text-sm text-stone-700">
          <div>
            <dt className="sr-only">Tür</dt>
            <dd>{speciesLabels[animal.species]}</dd>
          </div>
          <div>
            <dt className="sr-only">Cinsiyet</dt>
            <dd>{genderLabels[animal.gender]}</dd>
          </div>
          <div>
            <dt className="sr-only">Yaş</dt>
            <dd>{ageLabels[animal.ageGroup]}</dd>
          </div>
          <div>
            <dt className="sr-only">Durum</dt>
            <dd>{statusLabels[animal.adoptionStatus]}</dd>
          </div>
        </dl>
        <Link
          href={`/can-dostlarimiz/${animal.slug}`}
          className="inline-flex w-full items-center justify-center rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
        >
          Detayları Gör
        </Link>
      </div>
    </article>
  );
}
