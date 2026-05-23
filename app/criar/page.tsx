import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { FormWizard } from "@/components/FormWizard";

export default function CriarPage() {
  return (
    <main className="subtle-field min-h-screen bg-[#f9f9f9] px-5 py-5 sm:px-6">
      <div className="mx-auto mb-8 flex w-full max-w-6xl items-center justify-between">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 text-sm font-black text-brasil-blue shadow-sm ring-1 ring-slate-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Camisa 10
        </Link>
        <span className="rounded-lg bg-brasil-yellow px-4 py-2 text-sm font-black text-brasil-blue">
          R$9,90
        </span>
      </div>
      <FormWizard />
    </main>
  );
}
