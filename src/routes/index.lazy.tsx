import { createLazyFileRoute, Link } from "@tanstack/react-router";
import boPaperLogo from "./../assets/logos-horizontal.png";

function Index() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-gray-100 to-gray-300">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <img src={boPaperLogo} alt="Logo BO Paper" />
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-800 sm:text-[5rem]">
            Almox Manager
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-black/5 p-4 text-black hover:bg-black/10"
              to="/celulose"
            >
              <h3 className="text-2xl font-bold">Celulose →</h3>
              <div className="text-lg">
                Interface para registros das cargas de celulose consumidas no
                desagregador.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-black/5 p-4 text-black hover:bg-black/10"
              to="/celulose/report"
            >
              <h3 className="text-2xl font-bold">Relatórios →</h3>
              <div className="text-lg">
                Extração de relatórios detalhados do consumo registrado no
                desagregador.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-black/5 p-4 text-black hover:bg-black/10"
              to="/insumos"
            >
              <h3 className="text-2xl font-bold">Insumos →</h3>
              <div className="text-lg">
                Controle de insumos do almoxarifado.
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export const Route = createLazyFileRoute("/")({
  component: Index,
});
