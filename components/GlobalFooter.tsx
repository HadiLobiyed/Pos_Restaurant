import Link from "next/link";

export function GlobalFooter() {
  return (
    <footer className="border-t border-dark-200/80 bg-dark-50 py-3 text-center text-xs text-dark-500">
      <Link
        href="https://noblexagency.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-dark-600 transition hover:text-primary-600"
      >
        Powred By NOBLEX 3
      </Link>
    </footer>
  );
}
