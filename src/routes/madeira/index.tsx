import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";

function RouteComponent() {
  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-2">
        <Navbar />
        <h1>Insumos</h1>
      </main>
    </>
  );
}

export const Route = createFileRoute("/madeira/")({
  component: RouteComponent,
});
