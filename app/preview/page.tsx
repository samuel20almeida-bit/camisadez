import type { Metadata } from "next";
import { PreviewClient } from "@/components/PreviewClient";

export const metadata: Metadata = {
  title: "Sua figurinha | Camisa 10",
  robots: { index: false },
};

type PreviewPageProps = {
  searchParams: {
    id?: string;
  };
};

export default function PreviewPage({ searchParams }: PreviewPageProps) {
  return <PreviewClient stickerId={searchParams.id} />;
}
