import { createLazyFileRoute } from "@tanstack/react-router";
import Header from "../components/header";

function Report() {
  return (
    <>
      <Header />
      <div>cellulose route</div>
    </>
  );
}

export const Route = createLazyFileRoute("/report")({
  component: Report,
});
