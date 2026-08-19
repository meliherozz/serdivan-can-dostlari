'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ageLabels, genderLabels, sizeLabels, speciesLabels } from '@/utils/labels';

const filters = [
  { name: 'species', label: 'Tür', options: speciesLabels },
  { name: 'gender', label: 'Cinsiyet', options: genderLabels },
  { name: 'ageGroup', label: 'Yaş', options: ageLabels },
  { name: 'size', label: 'Boyut', options: sizeLabels },
] as const;

export function AnimalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (name: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(name, value);
    else next.delete(name);
    router.push(`/can-dostlarimiz?${next.toString()}`);
  };

  return (
    <form className="grid gap-3 rounded-lg border border-stone-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
      {filters.map((filter) => (
        <label key={filter.name} className="text-sm font-medium text-stone-800">
          {filter.label}
          <select
            value={searchParams.get(filter.name) ?? ''}
            onChange={(event) => updateFilter(filter.name, event.target.value)}
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-950 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="">Tümü</option>
            {Object.entries(filter.options).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      ))}
    </form>
  );
}
