'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { submitAdoptionApplication } from '@/lib/strapi/client';
import type { Animal, AdoptionApplicationInput, HousingType } from '@/types/domain';
import { housingLabels } from '@/utils/labels';

type Props = {
  animal: Animal;
};

const initialState: AdoptionApplicationInput = {
  animalSlug: '',
  fullName: '',
  phone: '',
  email: '',
  city: '',
  district: '',
  housingType: 'apartment',
  hasGarden: false,
  hasOtherPets: false,
  otherPetsDescription: '',
  previousPetExperience: '',
  reasonForAdoption: '',
  consentAccepted: false,
  website: '',
};

export function AdoptionForm({ animal }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<AdoptionApplicationInput>({ ...initialState, animalSlug: animal.slug });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const setValue = <K extends keyof AdoptionApplicationInput>(key: K, value: AdoptionApplicationInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (form.reasonForAdoption.trim().length < 20) {
      setError('Sahiplenme nedeni en az 20 karakter olmalıdır.');
      return;
    }

    setPending(true);
    const result = await submitAdoptionApplication(form);
    setPending(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    router.push(`/basvuru-basarili?referenceCode=${encodeURIComponent(result.referenceCode)}`);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
          {error}
        </div>
      ) : null}

      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(event) => setValue('website', event.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-stone-800">
          Ad soyad
          <input required minLength={3} maxLength={120} value={form.fullName} onChange={(event) => setValue('fullName', event.target.value)} className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2" />
        </label>
        <label className="text-sm font-medium text-stone-800">
          Telefon
          <input required maxLength={24} value={form.phone} onChange={(event) => setValue('phone', event.target.value)} className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2" />
        </label>
        <label className="text-sm font-medium text-stone-800">
          E-posta
          <input required type="email" maxLength={160} value={form.email} onChange={(event) => setValue('email', event.target.value)} className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2" />
        </label>
        <label className="text-sm font-medium text-stone-800">
          İl
          <input required maxLength={80} value={form.city} onChange={(event) => setValue('city', event.target.value)} className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2" />
        </label>
        <label className="text-sm font-medium text-stone-800">
          İlçe
          <input required maxLength={80} value={form.district} onChange={(event) => setValue('district', event.target.value)} className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2" />
        </label>
        <label className="text-sm font-medium text-stone-800">
          Konut tipi
          <select value={form.housingType} onChange={(event) => setValue('housingType', event.target.value as HousingType)} className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2">
            {Object.entries(housingLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-3 rounded-md border border-stone-200 p-3 text-sm font-medium text-stone-800">
          <input type="checkbox" checked={form.hasGarden} onChange={(event) => setValue('hasGarden', event.target.checked)} />
          Bahçem var
        </label>
        <label className="flex items-center gap-3 rounded-md border border-stone-200 p-3 text-sm font-medium text-stone-800">
          <input type="checkbox" checked={form.hasOtherPets} onChange={(event) => setValue('hasOtherPets', event.target.checked)} />
          Başka evcil hayvanım var
        </label>
      </div>

      <label className="block text-sm font-medium text-stone-800">
        Diğer evcil hayvanlar
        <textarea maxLength={500} value={form.otherPetsDescription} onChange={(event) => setValue('otherPetsDescription', event.target.value)} className="mt-2 min-h-24 w-full rounded-md border border-stone-300 px-3 py-2" />
      </label>
      <label className="block text-sm font-medium text-stone-800">
        Önceki hayvan bakım deneyimi
        <textarea maxLength={700} value={form.previousPetExperience} onChange={(event) => setValue('previousPetExperience', event.target.value)} className="mt-2 min-h-24 w-full rounded-md border border-stone-300 px-3 py-2" />
      </label>
      <label className="block text-sm font-medium text-stone-800">
        Sahiplenme nedeni
        <textarea required minLength={20} maxLength={1000} value={form.reasonForAdoption} onChange={(event) => setValue('reasonForAdoption', event.target.value)} className="mt-2 min-h-32 w-full rounded-md border border-stone-300 px-3 py-2" />
      </label>

      <div className="rounded-md bg-stone-50 p-4 text-sm text-stone-700">
        KVKK/Aydınlatma metni belediye tarafından onaylandıktan sonra bu alana eklenecektir.
      </div>
      <label className="flex items-start gap-3 text-sm font-medium text-stone-800">
        <input required type="checkbox" checked={form.consentAccepted} onChange={(event) => setValue('consentAccepted', event.target.checked)} className="mt-1" />
        Kişisel verilerimin bu başvurunun değerlendirilmesi amacıyla işlenmesine ilişkin bilgilendirmeyi okudum.
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        {pending ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
      </button>
    </form>
  );
}
