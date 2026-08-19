export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-stone-100">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm sm:grid-cols-3">
        <div>
          <p className="font-semibold">Serdivan Belediyesi Can Dostları</p>
          <p className="mt-2 text-stone-300">Dijital hayvan sahiplendirme MVP prototipi.</p>
        </div>
        <div>
          <p className="font-semibold">Demo Uyarısı</p>
          <p className="mt-2 text-stone-300">Bu sürümdeki kayıtlar kurgusaldır; gerçek vatandaş verisi içermez.</p>
        </div>
        <div>
          <p className="font-semibold">KVKK</p>
          <p className="mt-2 text-stone-300">Hukuki metinler belediye onayından sonra eklenecektir.</p>
        </div>
      </div>
    </footer>
  );
}
