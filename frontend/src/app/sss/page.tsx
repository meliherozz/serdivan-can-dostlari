import { getFAQs } from '@/lib/strapi/client';

export default async function FAQPage() {
  const faqs = await getFAQs().catch(() => []);

  return (
    <div className="bg-[radial-gradient(circle_at_16%_0%,rgba(223,234,223,0.82),transparent_28rem),var(--color-surface)]">
      <section className="border-b border-[var(--color-border)] bg-[rgba(243,239,230,0.78)]">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-[1fr_340px] md:items-end md:py-14">
          <div>
            <p className="text-sm font-bold uppercase text-[var(--color-primary)]">Bilgilendirme</p>
            <h1 className="mt-2 text-5xl font-black leading-tight text-[var(--color-text)]">Sık Sorulan Sorular</h1>
            <p className="mt-4 max-w-2xl leading-8 text-[var(--color-muted)]">
              Sahiplendirme süreciyle ilgili en çok merak edilen konuların yanıtlarını burada bulabilirsiniz.
            </p>
          </div>

          <aside className="rounded-lg border border-[var(--color-border)] bg-white/82 p-5 shadow-[0_16px_44px_rgba(31,37,33,0.08)] backdrop-blur">
            <p className="text-sm font-black text-[var(--color-text)]">Aradığınız yanıtı bulamadınız mı?</p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              Aradığınız yanıtı bulamıyorsanız belediye tarafından sağlanan iletişim kanallarını kullanabilirsiniz.
            </p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="rounded-lg border border-[var(--color-border)] bg-[rgba(251,250,246,0.94)] p-4 shadow-[0_20px_62px_rgba(31,37,33,0.08)] backdrop-blur md:p-6">
          {faqs.length > 0 ? (
            <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
              {faqs.map((faq) => (
                <details key={faq.id} className="group">
                  <summary className="focus-ring flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 font-black text-[var(--color-text)] transition duration-200 hover:bg-[var(--color-primary-soft)] md:px-6">
                    <span className="pr-2">{faq.question}</span>
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-2xl leading-none text-[var(--color-primary)] transition duration-200 group-open:rotate-45 group-open:border-[var(--color-primary)] group-open:bg-[var(--color-primary-soft)]"
                    >
                      +
                    </span>
                  </summary>
                  <div className="bg-[var(--color-surface)] px-4 pb-5 pt-1 md:px-6">
                    <p className="max-w-3xl leading-8 text-[var(--color-muted)]">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-white p-8 text-center">
              <p className="font-bold text-[var(--color-text)]">Şu anda yayınlanmış sık sorulan soru bulunmuyor.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
