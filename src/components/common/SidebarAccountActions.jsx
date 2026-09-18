function GooglePlayIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M3.6 2.3c-.4.2-.6.6-.6 1.1v17.2c0 .5.2.9.6 1.1l9.5-9.7-9.5-9.7Z" fill="#00d2ff" />
      <path d="M13.1 12l3-3.1-9.3-5.4c-.4-.2-.8-.3-1.2-.2l7.5 8.7Z" fill="#00f076" />
      <path d="M13.1 12l-7.5 8.7c.4.1.8 0 1.2-.2l9.3-5.4-3-3.1Z" fill="#ff3a44" />
      <path d="M19.6 10.4l-3.5-2-3 3.1 3 3.1 3.5-2c.9-.5.9-1.7 0-2.2Z" fill="#ffcd00" />
    </svg>
  );
}

function AppleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.5 1.5c.1 1.1-.3 2.2-1 3-.7.8-1.8 1.5-2.9 1.4-.1-1.1.4-2.2 1-3 .8-.8 2-1.4 2.9-1.4ZM20.7 17.3c-.4 1-.9 1.9-1.6 2.8-.9 1.2-1.9 2.6-3.3 2.6-1.2 0-1.6-.8-3-.8-1.5 0-1.9.8-3 .8-1.3 0-2.3-1.3-3.2-2.5-1.9-2.6-3.3-7.3-1.4-10.5.9-1.6 2.6-2.6 4.4-2.6 1.3 0 2.4.9 3.2.9.8 0 2.2-1.1 3.7-.9.6 0 2.4.2 3.5 1.9-.1.1-2.1 1.2-2.1 3.7 0 2.9 2.5 3.9 2.8 4.1Z" />
    </svg>
  );
}

export default function SidebarAccountActions() {
  return (
    <div className="p-4 border-b border-black/5 dark:border-white/5">
      <p className="text-xs font-gu tracking-wide text-ink/50 dark:text-ink-dark/50 mb-2.5 px-0.5">
        એપ ડાઉનલોડ કરો
      </p>

      <div className="flex flex-col gap-2.5">
        <a
          href="#android"
          className="flex items-center gap-3 rounded-2xl border border-ink/15 dark:border-ink-dark/20
                     bg-black/[0.02] dark:bg-white/[0.03] backdrop-blur-md px-3.5 py-2.5
                     shadow-xs hover:bg-black/5 dark:hover:bg-white/10
                     active:scale-[0.98] active:opacity-80
                     transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]"
        >
          <GooglePlayIcon width={20} height={20} className="shrink-0" />
          <span className="leading-tight">
            <span className="block text-[10px] font-en uppercase tracking-wider text-ink/50 dark:text-ink-dark/50 font-medium">
              Get it on
            </span>
            <span className="block text-sm font-en font-semibold text-ink dark:text-ink-dark">
              Google Play
            </span>
          </span>
        </a>

        <a
          href="#ios"
          className="flex items-center gap-3 rounded-2xl border border-ink/15 dark:border-ink-dark/20
                     bg-black/[0.02] dark:bg-white/[0.03] backdrop-blur-md px-3.5 py-2.5
                     shadow-xs hover:bg-black/5 dark:hover:bg-white/10
                     active:scale-[0.98] active:opacity-80
                     transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]"
        >
          <AppleIcon width={20} height={20} className="shrink-0 text-ink dark:text-ink-dark" />
          <span className="leading-tight">
            <span className="block text-[10px] font-en uppercase tracking-wider text-ink/50 dark:text-ink-dark/50 font-medium">
              Download on the
            </span>
            <span className="block text-sm font-en font-semibold text-ink dark:text-ink-dark">
              App Store
            </span>
          </span>
        </a>
      </div>
    </div>
  );
}