import Link from "next/link";

export function GlobalFooter() {
  return (
    <footer className="bg-dark-950">
      <div className="page-shell">
        <div className="flex items-center justify-center border-t border-white/[0.06] py-6">
          <Link
            href="https://noblexagency.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 no-underline"
          >
            <span
              className="h-px w-10 bg-gradient-to-r from-transparent to-white/15 transition group-hover:to-primary-500/40"
              aria-hidden
            />
            <span className="text-center text-[11px] font-medium uppercase tracking-[0.22em] text-dark-500 transition group-hover:text-dark-400">
              Powered by{" "}
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text font-semibold tracking-[0.18em] text-transparent transition group-hover:from-primary-300 group-hover:to-accent-300">
                Noblex
              </span>
            </span>
            <span
              className="h-px w-10 bg-gradient-to-l from-transparent to-white/15 transition group-hover:to-primary-500/40"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
