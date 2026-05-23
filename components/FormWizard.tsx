"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, UploadCloud } from "lucide-react";

type FormState = {
  firstName: string;
  lastName: string;
  day: string;
  month: string;
  year: string;
  heightCm: string;
  weightKg: string;
  team: string;
  photo: File | null;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  day: "",
  month: "",
  year: "",
  heightCm: "",
  weightKg: "",
  team: "",
  photo: null,
};

const months = Array.from({ length: 12 }, (_, index) => String(index + 1));
const days = Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, "0"));
const years = Array.from({ length: 95 }, (_, index) => String(2026 - index));
const teams = [
  "Flamengo",
  "Corinthians",
  "Palmeiras",
  "São Paulo",
  "Santos",
  "Grêmio",
  "Internacional",
  "Cruzeiro",
  "Atlético-MG",
  "Vasco",
  "Bahia",
  "Botafogo",
];

const stepLabels = ["Nome", "Nascimento", "Medidas", "Time", "Foto"];

export function FormWizard() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const progress = (step / 5) * 100;
  const birthDate = useMemo(() => {
    if (!form.day || !form.month || !form.year) {
      return "";
    }

    return `${form.day}-${Number(form.month)}-${form.year}`;
  }, [form.day, form.month, form.year]);

  const formattedStats = useMemo(() => {
    const height = Number(form.heightCm);
    const weight = Number(form.weightKg);

    if (!height || !weight) {
      return "";
    }

    return `${(height / 100).toFixed(2).replace(".", ",")}m | ${weight} kg`;
  }, [form.heightCm, form.weightKg]);

  const update = (key: keyof FormState, value: string | File | null) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const validateStep = () => {
    if (step === 1 && (!form.firstName.trim() || !form.lastName.trim())) {
      return "Preencha nome e sobrenome para continuar.";
    }

    if (step === 2 && !birthDate) {
      return "Selecione dia, mês e ano de nascimento.";
    }

    if (step === 3 && (!Number(form.heightCm) || !Number(form.weightKg))) {
      return "Informe altura e peso em números.";
    }

    if (step === 4 && !form.team.trim()) {
      return "Informe o time do coração.";
    }

    if (step === 5 && !form.photo) {
      return "Escolha uma foto do craque.";
    }

    return "";
  };

  const goNext = () => {
    const validation = validateStep();

    if (validation) {
      setError(validation);
      return;
    }

    setStep((current) => Math.min(current + 1, 5));
  };

  const handlePhoto = (file?: File) => {
    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Use uma foto em JPG, PNG ou WEBP.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("A foto deve ter no máximo 10MB.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    update("photo", file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const submit = async () => {
    const validation = validateStep();

    if (validation) {
      setError(validation);
      return;
    }

    setIsSubmitting(true);
    setError("");

    const payload = new FormData();
    payload.append("firstName", form.firstName);
    payload.append("lastName", form.lastName);
    payload.append("birthDate", birthDate);
    payload.append("heightCm", form.heightCm);
    payload.append("weightKg", form.weightKg);
    payload.append("team", form.team);

    if (form.photo) {
      payload.append("photo", form.photo);
    }

    const response = await fetch("/api/stickers", {
      method: "POST",
      body: payload,
    });

    const result = (await response.json()) as { id?: string; error?: string };

    if (!response.ok || !result.id) {
      setIsSubmitting(false);
      setError(result.error ?? "Não foi possível gerar sua figurinha.");
      return;
    }

    router.push(`/preview?id=${result.id}`);
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="mb-3 flex items-center justify-between text-sm font-bold text-brasil-blue">
          <span>Etapa {step}/5</span>
          <span>{stepLabels[step - 1]}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brasil-green transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {stepLabels.map((label, index) => (
            <div
              key={label}
              className={index + 1 <= step ? "h-1.5 rounded-full bg-brasil-yellow" : "h-1.5 rounded-full bg-slate-200"}
              aria-label={label}
            />
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-white p-5 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200 sm:p-7">
        {isSubmitting ? (
          <div className="grid min-h-[420px] place-items-center text-center">
            <div>
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-lg bg-brasil-green/10 text-brasil-green">
                <Loader2 className="h-11 w-11 animate-spin" />
              </div>
              <h1 className="mt-6 text-2xl font-black text-brasil-blue">
                Gerando sua figurinha...
              </h1>
              <p className="mt-2 text-slate-600">Preparando foto, dados e preview.</p>
              <div className="mx-auto mt-7 h-2 max-w-xs overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-brasil-yellow" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {step === 1 && (
              <StepShell title="Qual é o nome do craque?">
                <div className="grid gap-4">
                  <Input
                    label="Nome"
                    placeholder="Ex: Gabriel"
                    value={form.firstName}
                    onChange={(value) => update("firstName", value)}
                  />
                  <Input
                    label="Sobrenome"
                    placeholder="Ex: Silva"
                    value={form.lastName}
                    onChange={(value) => update("lastName", value)}
                  />
                </div>
              </StepShell>
            )}

            {step === 2 && (
              <StepShell title="Quando nasceu o craque?">
                <div className="grid grid-cols-3 gap-3">
                  <Select label="Dia" value={form.day} onChange={(value) => update("day", value)}>
                    <option value="">Dia</option>
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </Select>
                  <Select label="Mês" value={form.month} onChange={(value) => update("month", value)}>
                    <option value="">Mês</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </Select>
                  <Select label="Ano" value={form.year} onChange={(value) => update("year", value)}>
                    <option value="">Ano</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Select>
                </div>
                {birthDate ? (
                  <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm font-bold text-brasil-blue">
                    Saída: {birthDate}
                  </p>
                ) : null}
              </StepShell>
            )}

            {step === 3 && (
              <StepShell title="Qual a altura e peso?">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Altura (cm)"
                    placeholder="Ex: 175"
                    type="number"
                    value={form.heightCm}
                    onChange={(value) => update("heightCm", value)}
                  />
                  <Input
                    label="Peso (kg)"
                    placeholder="Ex: 70"
                    type="number"
                    value={form.weightKg}
                    onChange={(value) => update("weightKg", value)}
                  />
                </div>
                {formattedStats ? (
                  <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm font-bold text-brasil-blue">
                    Saída: {formattedStats}
                  </p>
                ) : null}
              </StepShell>
            )}

            {step === 4 && (
              <StepShell title="Qual é o time do coração?">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Time do coração
                  </span>
                  <input
                    list="teams"
                    className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base outline-none transition focus:border-brasil-green focus:ring-4 focus:ring-brasil-green/15"
                    placeholder="Ex: Flamengo, Corinthians..."
                    value={form.team}
                    onChange={(event) => update("team", event.target.value)}
                  />
                </label>
                <datalist id="teams">
                  {teams.map((team) => (
                    <option key={team} value={team} />
                  ))}
                </datalist>
              </StepShell>
            )}

            {step === 5 && (
              <StepShell title="Agora envie a foto do craque!">
                <p className="mb-4 text-sm leading-6 text-slate-600">
                  Use uma foto de rosto, com boa iluminação, fundo limpo e sem óculos escuros.
                </p>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    handlePhoto(event.dataTransfer.files[0]);
                  }}
                  className="flex min-h-[210px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-brasil-green/55 bg-brasil-green/5 px-5 text-center transition hover:border-brasil-green hover:bg-brasil-green/10"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview da foto selecionada"
                      className="h-44 w-44 rounded-lg object-cover shadow-lg"
                    />
                  ) : (
                    <>
                      <UploadCloud className="h-12 w-12 text-brasil-green" />
                      <span className="mt-4 text-base font-black text-brasil-blue">
                        Toque para enviar ou arraste a foto
                      </span>
                      <span className="mt-2 text-sm text-slate-600">JPG, PNG ou WEBP até 10MB</span>
                    </>
                  )}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) => handlePhoto(event.target.files?.[0])}
                />
              </StepShell>
            )}

            {error ? (
              <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            ) : null}

            <div className="mt-8 flex gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setStep((current) => current - 1);
                    setError("");
                  }}
                  className="grid min-h-12 w-14 shrink-0 place-items-center rounded-lg border border-slate-300 bg-white text-brasil-blue transition hover:bg-slate-50"
                  aria-label="Voltar etapa"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              ) : null}
              <button
                type="button"
                onClick={step === 5 ? submit : goNext}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-brasil-green px-5 text-base font-black text-white shadow-lg shadow-brasil-green/25 transition hover:-translate-y-0.5 hover:bg-[#008633]"
              >
                {step === 5 ? (
                  <>
                    Gerar minha figurinha! <span aria-hidden>🎴</span>
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StepShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brasil-yellow text-brasil-blue">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-black leading-tight text-brasil-blue sm:text-3xl">{title}</h1>
      </div>
      {children}
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base outline-none transition focus:border-brasil-green focus:ring-4 focus:ring-brasil-green/15"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-base outline-none transition focus:border-brasil-green focus:ring-4 focus:ring-brasil-green/15"
      >
        {children}
      </select>
    </label>
  );
}
