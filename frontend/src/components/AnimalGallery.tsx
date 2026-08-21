'use client';

import { useMemo, useState } from 'react';
import type { Animal, MediaAsset } from '@/types/domain';
import { speciesLabels } from '@/utils/labels';
import { getPrimaryAnimalImage } from './AnimalImage';

type Props = {
  animal: Animal;
};

const uniqueImages = (animal: Animal): MediaAsset[] => {
  const images = [animal.featuredImage, ...(animal.images ?? [])].filter((asset): asset is MediaAsset => Boolean(asset?.url));
  const seen = new Set<string>();
  return images.filter((asset) => {
    if (seen.has(asset.url)) return false;
    seen.add(asset.url);
    return true;
  });
};

export function AnimalGallery({ animal }: Props) {
  const images = useMemo(() => uniqueImages(animal), [animal]);
  const [selectedUrl, setSelectedUrl] = useState(() => getPrimaryAnimalImage(animal)?.url ?? null);
  const selected = images.find((image) => image.url === selectedUrl) ?? images[0] ?? null;

  if (!selected) {
    return (
      <div
        className="relative flex aspect-[4/3] min-h-80 w-full flex-col justify-end overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-primary-soft)] p-8"
        role="img"
        aria-label={`${animal.name} görsel alanı`}
      >
        <span className="absolute right-8 top-8 h-28 w-28 rounded-full border border-[var(--color-primary)]/15" aria-hidden="true" />
        <span className="text-sm font-bold uppercase text-[var(--color-primary)]">{speciesLabels[animal.species]}</span>
        <p className="mt-2 max-w-md text-5xl font-black leading-tight text-[var(--color-text)]">{animal.name}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="group overflow-hidden rounded-lg border border-[var(--color-border)] bg-white p-2 shadow-[0_20px_55px_rgba(31,37,33,0.12)]">
        <div
          role="img"
          aria-label={selected.alternativeText || `${animal.name} fotoğrafı`}
          className="image-zoom aspect-[4/3] min-h-80 rounded-md bg-stone-100 bg-cover bg-center"
          style={{ backgroundImage: `url(${selected.url})` }}
        />
      </div>

      {images.length > 1 ? (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1" aria-label={`${animal.name} fotoğraf galerisi`}>
          {images.map((image, index) => {
            const isSelected = image.url === selected.url;
            return (
              <button
                type="button"
                key={image.url}
                aria-label={`${animal.name} fotoğraf ${index + 1}`}
                aria-current={isSelected ? 'true' : undefined}
                onClick={() => setSelectedUrl(image.url)}
                className={`focus-ring h-20 w-24 shrink-0 rounded-md border bg-stone-100 bg-cover bg-center transition duration-200 hover:border-[var(--color-primary)] hover:brightness-105 ${
                  isSelected ? 'border-[var(--color-primary)] ring-2 ring-emerald-900/15' : 'border-[var(--color-border)] opacity-85'
                }`}
                style={{ backgroundImage: `url(${image.url})` }}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
