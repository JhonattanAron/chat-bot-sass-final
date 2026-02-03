import Header from "@/components/header";
import { LEGAL_CONTENT, LegalSlug } from "../../content";

interface Props {
  slug: LegalSlug;
}

export function LegalPage({ slug }: Props) {
  const data = LEGAL_CONTENT[slug];

  if (!data) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-3xl font-bold">Documento no encontrado</h1>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <section className="py-24 max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-2">{data.title}</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Última actualización: {data.updatedAt}
        </p>

        <article className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-line">
          {data.content}
        </article>
      </section>
    </div>
  );
}
