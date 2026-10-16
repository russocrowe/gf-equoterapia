import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1240px] px-6 py-24 md:px-10 md:py-32">
      <p className="eyebrow">Página não encontrada</p>
      <h1 className="my-6 max-w-2xl">
        Não achamos esse caminho, mas <em>podemos recomeçar.</em>
      </h1>
      <p className="lead max-w-xl">
        O endereço pode ter mudado ou a página não existe mais. Volte para o
        início ou conheça nossas matérias.
      </p>
      <div className="mt-9 flex flex-wrap gap-4">
        <Link href="/" className="btn btn-primary">
          Ir para o início
        </Link>
        <Link href="/equoterapia" className="btn btn-outline">
          Ver matérias
        </Link>
      </div>
    </div>
  );
}
