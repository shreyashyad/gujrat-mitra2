import { socialLinks } from "../../data/socialLinks.js";

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.5 6.5s-.23-1.64-.94-2.36c-.9-.95-1.9-.95-2.36-1C16.9 2.8 12 2.8 12 2.8h-.01s-4.9 0-8.2.34c-.46.05-1.46.05-2.36 1C.72 4.86.5 6.5.5 6.5S.26 8.42.26 10.35v1.79c0 1.93.24 3.85.24 3.85s.23 1.64.94 2.36c.9.95 2.08.92 2.6 1.02 1.9.18 8.06.34 8.06.34s4.9 0 8.2-.34c.46-.06 1.46-.06 2.36-1.02.71-.72.94-2.36.94-2.36s.24-1.92.24-3.85v-1.79c0-1.93-.24-3.85-.24-3.85ZM9.68 14.6V7.9l6.44 3.36-6.44 3.35Z" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.146 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.966 6.817H1.583l7.73-8.835L1.166 2.25h6.826l4.713 6.231ZM16.99 19.77h1.833L7.084 4.126H5.117Z" />
    </svg>
  );
}

function WhatsappIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.28-1.38a9.87 9.87 0 0 0 4.71 1.2h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.07c-.24.68-1.4 1.3-1.93 1.35-.5.05-1.05.24-3.51-.73-2.96-1.18-4.87-4.2-5.02-4.4-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.45.27-.29.6-.36.8-.36.2 0 .4 0 .58.01.19.01.44-.07.68.53.25.6.85 2.06.92 2.21.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.26 1.63 2.04 1.12 1 2.06 1.31 2.36 1.46.3.15.47.13.65-.08.17-.2.73-.85.93-1.14.2-.29.4-.24.66-.14.27.1 1.72.81 2.02.96.3.15.5.22.57.35.08.13.08.75-.16 1.43Z" />
    </svg>
  );
}

const ICONS = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  x: XIcon,
  whatsapp: WhatsappIcon,
};

const BRAND_BG = {
  facebook: "bg-[#1877F2]",
  x: "bg-black dark:bg-white",
  instagram: "",
  youtube: "bg-[#FF0000]",
  whatsapp: "bg-[#25D366]",
};

const ICON_COLOR = {
  facebook: "text-white",
  x: "text-white dark:text-black",
  instagram: "text-white",
  youtube: "text-white",
  whatsapp: "text-white",
};

const INSTAGRAM_GRADIENT = {
  backgroundImage: "linear-gradient(45deg, #f58529 0%, #dd2a7b 45%, #8134af 75%, #515bd4 100%)",
};

export default function SocialIcons() {
  return (
    <ul className="flex items-center gap-2">
      {socialLinks.map((social) => {
        const Icon = ICONS[social.id];
        return (
          <li key={social.id}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              title={social.label}
              style={social.id === "instagram" ? INSTAGRAM_GRADIENT : undefined}
              className={`flex h-8 w-8 items-center justify-center rounded-xl shadow-xs
                          transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]
                          hover:scale-110 hover:shadow-md
                          active:scale-[0.88] active:opacity-80
                          ${BRAND_BG[social.id]} ${ICON_COLOR[social.id]}`}
            >
              <Icon width={15} height={15} />
            </a>
          </li>
        );
      }
      )}
    </ul>
  );
}