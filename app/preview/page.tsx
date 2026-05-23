import { PreviewClient } from "@/components/PreviewClient";

type PreviewPageProps = {
  searchParams: {
    id?: string;
  };
};

export default function PreviewPage({ searchParams }: PreviewPageProps) {
  return <PreviewClient stickerId={searchParams.id} />;
}
