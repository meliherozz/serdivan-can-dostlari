import { getFAQs } from '@/lib/strapi/client';

export default async function FAQPage() {
  const faqs = await getFAQs().catch(() => []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">Sık Sorulan Sorular</h1>
      <div className="mt-6 space-y-4">
        {faqs.map((faq) => (
          <article key={faq.id} className="rounded-lg border border-stone-200 bg-white p-5">
            <h2 className="text-lg font-semibold">{faq.question}</h2>
            <p className="mt-2 leading-7 text-stone-600">{faq.answer}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
