export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-black text-[var(--color-text)]">Gizlilik ve KVKK</h1>
      <div className="mt-6 rounded-lg border border-[var(--color-border)] bg-white p-6 leading-8 text-[var(--color-muted)]">
        <p>
          Kişisel verileriniz sahiplendirme başvurularının değerlendirilmesi ve belediye hizmetlerinin yürütülmesi amacıyla işlenir.
        </p>
        <p className="mt-4">
          Sahiplendirme başvurusunda TC kimlik numarası, kimlik fotoğrafı, finansal bilgi, sağlık bilgisi veya e-Devlet
          bilgisi istenmez.
        </p>
      </div>
    </div>
  );
}
