import Link from 'next/link';
import { ReferenceCodePanel } from '@/components/ReferenceCodePanel';

type SuccessPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const referenceCode = typeof params.referenceCode === 'string' ? params.referenceCode : 'Referans kodu bulunamadı';

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center md:py-16">
      <div className="rounded-lg border border-[var(--color-border)] bg-white p-8 shadow-[0_20px_60px_rgba(31,37,33,0.1)]">
        <p className="text-sm font-bold uppercase text-[var(--color-primary)]">Başvurunuz Alındı</p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-[var(--color-text)]">Başvurunuz değerlendirme birimine iletildi.</h1>
        <p className="mt-4 leading-7 text-[var(--color-muted)]">
          Serdivan Belediyesi ilgili birimi başvurunuzu değerlendirecektir. Lütfen referans numaranızı saklayın.
        </p>
        <ReferenceCodePanel referenceCode={referenceCode} />
        <Link href="/can-dostlarimiz" className="btn-secondary focus-ring mt-7 px-4 py-2 text-sm">
          Can Dostlarımıza Dön
        </Link>
      </div>
    </div>
  );
}
