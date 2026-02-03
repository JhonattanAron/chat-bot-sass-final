import { LegalPage } from "@/components/pages/legal/components/legal/LegalPage";
import { LegalSlug } from "@/components/pages/legal/content";
import { notFound } from "next/navigation";

interface PageProps {
  params: { slug: string };
}

export default function Page({ params }: PageProps) {
  const slug = params.slug as LegalSlug;

  const validSlugs: LegalSlug[] = [
    "terminos",
    "privacidad",
    "cookies",
    "aviso-legal",
    "devoluciones",
  ];

  if (!validSlugs.includes(slug)) {
    notFound();
  }

  return <LegalPage slug={slug} />;
}
