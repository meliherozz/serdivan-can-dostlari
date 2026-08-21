import Link from 'next/link';
import type { FAQ } from '@/types/domain';

type Props = {
  faqs: FAQ[];
};

export function HomeFaqPreview({ faqs }: Props) {
  return (
    <section className="relative z-10 bg-[rgba(251,250,246,0.96)]">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-[var(--color-primary)]">Bilgilendirme</p>
            <h2 className="mt-2 text-4xl font-black text-[var(--color-text)]">Sık Sorulan Sorular</h2>
            <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
              Sahiplendirme süreciyle ilgili en sık sorulan başlıklara hızlıca göz atın.
            </p>
          </div>
          <Link href="/sss" className="btn-ghost focus-ring px-1 py-2">
            Tüm soruları gör <span className="arrow-shift" aria-hidden="true">→</span>
          </Link>
        </div>

        {faqs.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {faqs.slice(0, 6).map((faq) => (
              <details key={faq.id} className="group interactive-card rounded-lg border border-[var(--color-border)] bg-white p-5">
                <summary className="focus-ring cursor-pointer list-none font-bold text-[var(--color-text)]">
                  <span className="inline-flex w-full items-center justify-between gap-4">
                    {faq.question}
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xl leading-none text-[var(--color-primary)] transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{faq.answer}</p>
              </details>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-[var(--color-border)] bg-white p-6 text-center">
            <p className="font-bold text-[var(--color-text)]">Şu anda yayınlanmış sık sorulan soru bulunmuyor.</p>
          </div>
        )}
      </div>
    </section>
  );
}
