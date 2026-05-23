"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  RefreshCcw,
  UploadCloud,
} from "lucide-react";
import { PACKS, type PackType } from "@/lib/packs";

type FormFields = {
  firstName: string;
  lastName: string;
  day: string;
  month: string;
  year: string;
  heightCm: string;
  weightKg: string;
  team: string;
};

type GeneratedSticker = {
  id: string;
  name: string;
  team: string;
  index: number;
};

type DraftState = {
  packType: PackType;
  activeIndex: number;
  step: number;
  mode: "editing" | "preview" | "summary";
  forms: FormFields[];
  generated: Array<GeneratedSticker | null>;
};

const emptyForm: FormFields = {
  firstName: "",
  lastName: "",
  day: "",
  month: "",
  year: "",
  heightCm: "",
  weightKg: "",
  team: "",
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

function createInitialDraft(packType: PackType): DraftState {
  const count = PACKS[packType].count;

  return {
    packType,
    activeIndex: 0,
    step: 1,
    mode: "editing",
    forms: Array.from({ length: count }, () => ({ ...emptyForm })),
    generated: Array.from({ length: count }, () => null),
  };
}

function normalizeDraft(packType: PackType, draft: Partial<DraftState> | null): DraftState {
  const initial = createInitialDraft(packType);

  if (!draft || draft.packType !== packType) {
    return initial;
  }

  const count = PACKS[packType].count;
  const forms = Array.from({ length: count }, (_, index) => ({
    ...emptyForm,
    ...(draft.forms?.[index] ?? {}),
  }));
  const generated = Array.from({ length: count }, (_, index) => draft.generated?.[index] ?? null);

  return {
    packType,
    activeIndex: Math.min(Math.max(draft.activeIndex ?? 0, 0), count - 1),
    step: Math.min(Math.max(draft.step ?? 1, 1), 5),
    mode: draft.mode ?? "editing",
    forms,
    generated,
  };
}

export function FormWizard({ packType }: { packType: PackType }) {
  const config = PACKS[packType];
  const fileRef = useRef<HTMLInputElement>(null);
  const storageKey = `camisa10:pack-draft:${packType}`;
  const [draft, setDraft] = useState<DraftState>(() => createInitialDraft(packType));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  const currentForm = draft.forms[draft.activeIndex] ?? emptyForm;
  const currentGenerated = draft.generated[draft.activeIndex];
  const generatedStickers = draft.generated.filter(Boolean) as GeneratedSticker[];
  const stepProgress = (draft.step / 5) * 100;
  const packProgress = ((draft.activeIndex + 1) / config.count) * 100;

  const birthDate = useMemo(() => {
    if (!currentForm.day || !currentForm.month || !currentForm.year) {
      return "";
    }

    return `${currentForm.day}-${Number(currentForm.month)}-${currentForm.year}`;
  }, [currentForm.day, currentForm.month, currentForm.year]);

  const formattedStats = useMemo(() => {
    const height = Number(currentForm.heightCm);
    const weight = Number(currentForm.weightKg);

    if (!height || !weight) {
      return "";
    }

    return `${(height / 100).toFixed(2).replace(".", ",")}m | ${weight} kg`;
  }, [currentForm.heightCm, currentForm.weightKg]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      const parsed = raw ? (JSON.parse(raw) as Partial<DraftState>) : null;
      setDraft(normalizeDraft(packType, parsed));
    } catch {
      setDraft(createInitialDraft(packType));
    } finally {
      setIsHydrated(true);
    }
  }, [packType, storageKey]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  }, [draft, isHydrated, storageKey]);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  const patchDraft = (patch: Partial<DraftState>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setError("");
  };

  const updateCurrentForm = (key: keyof FormFields, value: string) => {
    setDraft((current) => {
      const forms = [...current.forms];
      forms[current.activeIndex] = {
        ...forms[current.activeIndex],
        [key]: value,
      };

      return { ...current, forms };
    });
    setError("");
  };

  const validateStep = () => {
    if (draft.step === 1 && (!currentForm.firstName.trim() || !currentForm.lastName.trim())) {
      return "Preencha nome e sobrenome para continuar.";
    }

    if (draft.step === 2 && !birthDate) {
      return "Selecione dia, mês e ano de nascimento.";
    }

    if (draft.step === 3 && (!Number(currentForm.heightCm) || !Number(currentForm.weightKg))) {
      return "Informe altura e peso em números.";
    }

    if (draft.step === 4 && !currentForm.team.trim()) {
      return "Informe o time do coração.";
    }

    if (draft.step === 5 && !currentPhoto && !currentGenerated) {
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

    patchDraft({ step: Math.min(draft.step + 1, 5) });
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

    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }

    setCurrentPhoto(file);
    setPhotoPreviewUrl(URL.createObjectURL(file));
    setError("");
  };

  const generateCurrentSticker = async () => {
    const validation = validateStep();

    if (validation) {
      setError(validation);
      return;
    }

    if (currentGenerated && !currentPhoto) {
      patchDraft({ mode: "preview" });
      return;
    }

    if (!currentPhoto) {
      setError("Escolha uma foto do craque.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const payload = new FormData();
    payload.append("firstName", currentForm.firstName);
    payload.append("lastName", currentForm.lastName);
    payload.append("birthDate", birthDate);
    payload.append("heightCm", currentForm.heightCm);
    payload.append("weightKg", currentForm.weightKg);
    payload.append("team", currentForm.team);
    payload.append("photo", currentPhoto);

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

    const generatedId = result.id;

    setDraft((current) => {
      const generated = [...current.generated];
      generated[current.activeIndex] = {
        id: generatedId,
        name: `${currentForm.firstName} ${currentForm.lastName}`.trim(),
        team: currentForm.team,
        index: current.activeIndex,
      };

      return {
        ...current,
        generated,
        mode: "preview",
      };
    });
    setCurrentPhoto(null);
    setPhotoPreviewUrl("");
    setIsSubmitting(false);
  };

  const nextSticker = () => {
    if (draft.activeIndex + 1 >= config.count) {
      patchDraft({ mode: "summary" });
      return;
    }

    setCurrentPhoto(null);
    setPhotoPreviewUrl("");
    patchDraft({
      activeIndex: draft.activeIndex + 1,
      step: 1,
      mode: "editing",
    });
  };

  const resetDraft = () => {
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }

    setCurrentPhoto(null);
    setPhotoPreviewUrl("");
    const fresh = createInitialDraft(packType);
    setDraft(fresh);
    window.localStorage.setItem(storageKey, JSON.stringify(fresh));
    setError("");
  };

  const checkout = async () => {
    const stickerIds = draft.generated.map((sticker) => sticker?.id).filter(Boolean) as string[];

    if (stickerIds.length !== config.count) {
      setError("Gere todas as figurinhas antes de ir para o pagamento.");
      return;
    }

    setIsCheckingOut(true);
    setError("");

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        packType,
        stickerIds,
      }),
    });

    const result = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !result.url) {
      setIsCheckingOut(false);
      setError(result.error ?? "Não foi possível abrir o checkout.");
      return;
    }

    window.location.href = result.url;
  };

  if (!isHydrated) {
    return (
      <div className="mx-auto grid min-h-[420px] w-full max-w-2xl place-items-center rounded-lg bg-white p-8 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200">
        <Loader2 className="h-10 w-10 animate-spin text-brasil-green" />
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <FormShell config={config} draft={draft} resetDraft={resetDraft}>
        <div className="grid min-h-[420px] place-items-center text-center">
          <div>
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-lg bg-brasil-green/10 text-brasil-green">
              <Loader2 className="h-11 w-11 animate-spin" />
            </div>
            <h1 className="mt-6 text-2xl font-black text-brasil-blue">
              Gerando figurinha {draft.activeIndex + 1} de {config.count}...
            </h1>
            <p className="mt-2 text-slate-600">Preparando foto, dados e preview.</p>
            <div className="mx-auto mt-7 h-2 max-w-xs overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-brasil-yellow" />
            </div>
          </div>
        </div>
      </FormShell>
    );
  }

  if (draft.mode === "preview" && currentGenerated) {
    return (
      <FormShell config={config} draft={draft} resetDraft={resetDraft}>
        <div className="grid gap-6 md:grid-cols-[240px_1fr] md:items-center">
          <div className="mx-auto w-full max-w-[240px] overflow-hidden rounded-lg bg-white shadow-sticker ring-4 ring-white">
            <img
              src={`/api/stickers/${currentGenerated.id}/image?variant=preview`}
              alt={`Preview da figurinha ${draft.activeIndex + 1}`}
              className="aspect-[5/7] w-full object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm font-black uppercase text-brasil-green">
              Figurinha {draft.activeIndex + 1} de {config.count}
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-brasil-blue">
              Preview criado para {currentGenerated.name}.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Esta versão fica salva no seu pack. Se recarregar a página, as figurinhas já geradas continuam no resumo.
            </p>
            <button
              type="button"
              onClick={nextSticker}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brasil-green px-5 text-base font-black text-white shadow-lg shadow-brasil-green/25 transition hover:-translate-y-0.5 hover:bg-[#008633] sm:w-auto"
            >
              {draft.activeIndex + 1 === config.count ? "Ir para pagamento" : "Próxima figurinha"}
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </FormShell>
    );
  }

  if (draft.mode === "summary") {
    return (
      <FormShell config={config} draft={draft} resetDraft={resetDraft}>
        <div>
          <div className="text-center">
            <p className="text-sm font-black uppercase text-brasil-green">Resumo do pack</p>
            <h1 className="mt-2 text-3xl font-black text-brasil-blue">
              Revise suas {config.count} {config.count === 1 ? "figurinha" : "figurinhas"}.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Depois do pagamento, todas ficam disponíveis sem marca d&apos;água para download.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {draft.generated.map((sticker, index) => (
              <div key={index} className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
                {sticker ? (
                  <>
                    <img
                      src={`/api/stickers/${sticker.id}/image?variant=preview`}
                      alt={`Preview da figurinha ${index + 1}`}
                      className="aspect-[5/7] w-full rounded-lg object-cover shadow-sm"
                    />
                    <p className="mt-3 truncate text-sm font-black text-brasil-blue">{sticker.name}</p>
                    <p className="truncate text-xs font-semibold text-slate-500">{sticker.team}</p>
                  </>
                ) : (
                  <div className="grid aspect-[5/7] place-items-center rounded-lg border border-dashed border-slate-300 text-center text-sm font-bold text-slate-500">
                    Figurinha {index + 1} pendente
                  </div>
                )}
              </div>
            ))}
          </div>

          {error ? (
            <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={checkout}
            disabled={isCheckingOut || generatedStickers.length !== config.count}
            className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-lg bg-brasil-green px-6 text-base font-black text-white shadow-xl shadow-brasil-green/25 transition hover:-translate-y-0.5 hover:bg-[#008633] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCheckingOut ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <CreditCard className="h-5 w-5" />
            )}
            Ir para pagamento — {config.priceLabel}
          </button>
        </div>
      </FormShell>
    );
  }

  return (
    <FormShell config={config} draft={draft} resetDraft={resetDraft}>
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="mb-3 flex items-center justify-between text-sm font-bold text-brasil-blue">
          <span>Etapa {draft.step}/5</span>
          <span>{stepLabels[draft.step - 1]}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brasil-green transition-all duration-500"
            style={{ width: `${stepProgress}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {stepLabels.map((label, index) => (
            <div
              key={label}
              className={index + 1 <= draft.step ? "h-1.5 rounded-full bg-brasil-yellow" : "h-1.5 rounded-full bg-slate-200"}
              aria-label={label}
            />
          ))}
        </div>
      </div>

      {draft.step === 1 && (
        <StepShell title="Qual é o nome do craque?">
          <div className="grid gap-4">
            <Input
              label="Nome"
              placeholder="Ex: Gabriel"
              value={currentForm.firstName}
              onChange={(value) => updateCurrentForm("firstName", value)}
            />
            <Input
              label="Sobrenome"
              placeholder="Ex: Silva"
              value={currentForm.lastName}
              onChange={(value) => updateCurrentForm("lastName", value)}
            />
          </div>
        </StepShell>
      )}

      {draft.step === 2 && (
        <StepShell title="Quando nasceu o craque?">
          <div className="grid grid-cols-3 gap-3">
            <Select label="Dia" value={currentForm.day} onChange={(value) => updateCurrentForm("day", value)}>
              <option value="">Dia</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </Select>
            <Select label="Mês" value={currentForm.month} onChange={(value) => updateCurrentForm("month", value)}>
              <option value="">Mês</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </Select>
            <Select label="Ano" value={currentForm.year} onChange={(value) => updateCurrentForm("year", value)}>
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

      {draft.step === 3 && (
        <StepShell title="Qual a altura e peso?">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Altura (cm)"
              placeholder="Ex: 175"
              type="number"
              value={currentForm.heightCm}
              onChange={(value) => updateCurrentForm("heightCm", value)}
            />
            <Input
              label="Peso (kg)"
              placeholder="Ex: 70"
              type="number"
              value={currentForm.weightKg}
              onChange={(value) => updateCurrentForm("weightKg", value)}
            />
          </div>
          {formattedStats ? (
            <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm font-bold text-brasil-blue">
              Saída: {formattedStats}
            </p>
          ) : null}
        </StepShell>
      )}

      {draft.step === 4 && (
        <StepShell title="Qual é o time do coração?">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Time do coração</span>
            <input
              list="teams"
              className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base outline-none transition focus:border-brasil-green focus:ring-4 focus:ring-brasil-green/15"
              placeholder="Ex: Flamengo, Corinthians..."
              value={currentForm.team}
              onChange={(event) => updateCurrentForm("team", event.target.value)}
            />
          </label>
          <datalist id="teams">
            {teams.map((team) => (
              <option key={team} value={team} />
            ))}
          </datalist>
        </StepShell>
      )}

      {draft.step === 5 && (
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
            {photoPreviewUrl ? (
              <img
                src={photoPreviewUrl}
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
        {draft.step > 1 ? (
          <button
            type="button"
            onClick={() => patchDraft({ step: draft.step - 1 })}
            className="grid min-h-12 w-14 shrink-0 place-items-center rounded-lg border border-slate-300 bg-white text-brasil-blue transition hover:bg-slate-50"
            aria-label="Voltar etapa"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : null}
        <button
          type="button"
          onClick={draft.step === 5 ? generateCurrentSticker : goNext}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-brasil-green px-5 text-base font-black text-white shadow-lg shadow-brasil-green/25 transition hover:-translate-y-0.5 hover:bg-[#008633]"
        >
          {draft.step === 5 ? (
            <>
              Gerar figurinha {draft.activeIndex + 1}
              <ArrowRight className="h-5 w-5" />
            </>
          ) : (
            <>
              Continuar
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </FormShell>
  );
}

function FormShell({
  config,
  draft,
  resetDraft,
  children,
}: {
  config: (typeof PACKS)[PackType];
  draft: DraftState;
  resetDraft: () => void;
  children: React.ReactNode;
}) {
  const packProgress = ((draft.activeIndex + 1) / config.count) * 100;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-brasil-green">{config.title}</p>
            <h1 className="mt-1 text-2xl font-black text-brasil-blue">
              Figurinha {draft.activeIndex + 1} de {config.count}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-brasil-yellow px-3 py-2 text-sm font-black text-brasil-blue">
              {config.priceLabel}
            </span>
            <button
              type="button"
              onClick={resetDraft}
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-brasil-blue transition hover:bg-slate-50"
              aria-label="Limpar progresso"
              title="Limpar progresso"
            >
              <RefreshCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brasil-blue transition-all duration-500"
            style={{ width: `${packProgress}%` }}
          />
        </div>
      </div>

      <div className="rounded-lg bg-white p-5 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200 sm:p-7">
        {children}
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
        <h1 className="min-w-0 text-[1.65rem] font-black leading-tight text-brasil-blue sm:text-3xl">
          {title}
        </h1>
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
