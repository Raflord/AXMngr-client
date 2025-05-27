import { createLazyFileRoute } from "@tanstack/react-router";
import Header from "../../components/header";

export const Route = createLazyFileRoute("/insumos/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-2">
        <Header />
        <h1>Insumos</h1>
      </main>
    </>
  );
}
