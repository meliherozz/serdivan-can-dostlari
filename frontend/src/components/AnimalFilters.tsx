'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ageLabels, genderLabels, sizeLabels, speciesLabels, statusLabels } from '@/utils/labels';

const filters = [
  { name: 'species', label: 'Tür', options: speciesLabels },
  { name: 'gender', label: 'Cinsiyet', options: genderLabels },
  { name: 'ageGroup', label: 'Yaş', options: ageLabels },
  { name: 'size', label: 'Boyut', options: sizeLabels },
  { name: 'adoptionStatus', label: 'Durum', options: statusLabels },
] as const;

export function AnimalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasFilters = filters.some((filter) => searchParams.has(filter.name));

  const updateFilter = (name: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(name, value);
    else next.delete(name);
    const query = next.toString();
    router.push(query ? `/can-dostlarimiz?${query}` : '/can-dostlarimiz');
  };

  return (
    <form
      className="interactive-card rounded-lg border border-[var(--color-border)] bg-white p-4 shadow-[0_12px_34px_rgba(31,37,33,0.06)]"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="grid gap-3 md:grid-cols-5">
        {filters.map((filter) => (
          <label key={filter.name} className="text-xs font-bold uppercase text-[var(--color-muted)]">
            {filter.label}
            <select
              value={searchParams.get(filter.name) ?? ''}
              onChange={(event) => updateFilter(filter.name, event.target.value)}
              className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary)]/40 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-900/15"
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
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => router.push('/can-dostlarimiz')}
          disabled={!hasFilters}
          className="btn-secondary focus-ring px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Filtreleri Temizle
        </button>
      </div>
    </form>
  );
}
