import type { AdoptionStatus } from '@/types/domain';
import { statusLabels } from '@/utils/labels';

const badgeClasses: Record<AdoptionStatus, string> = {
  available: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  reserved: 'border-amber-200 bg-amber-50 text-amber-950',
  adopted: 'border-sky-200 bg-sky-50 text-sky-950',
  unavailable: 'border-stone-300 bg-stone-100 text-stone-800',
};

export function StatusBadge({ status }: { status: AdoptionStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-xs font-bold shadow-sm transition-colors duration-150 ${badgeClasses[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
