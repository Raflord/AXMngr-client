import { Link } from "@tanstack/react-router";
import boPaperLogo from "./../assets/logos-horizontal.png";

export default function Header() {
  return (
    <>
      <header>
        <nav className="my-4 flex flex-col items-center justify-around sm:flex-row sm:justify-between">
          <Link to="/" className="sm:ml-4 sm:mr-16">
            <img
              src={boPaperLogo}
              alt="Logo BO Paper"
              className="max-h-fit max-w-fit"
              loading="lazy"
            />
          </Link>
          <div className="mt-4 flex items-center gap-x-16 sm:m-0 sm:w-full">
            <Link
              to="/cellulose"
              className="text-lg font-bold text-gray-500 hover:underline"
            >
              Celulose
            </Link>
            <Link
              to="/report"
              className="text-lg font-bold text-gray-500 hover:underline"
            >
              Relatórios
            </Link>
          </div>
        </nav>
        <hr className="mb-4 rounded-full border border-gray-300" />
      </header>
    </>
  );
}
