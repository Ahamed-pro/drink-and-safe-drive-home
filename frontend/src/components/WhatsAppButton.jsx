import { whatsappLink } from "../lib/constants.js";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Message us on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-whatsapp-green px-4 py-3.5 text-white shadow-card transition hover:-translate-y-0.5 hover:pr-5 sm:bottom-8 sm:right-8"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.02 2C6.5 2 2 6.48 2 12c0 1.86.5 3.6 1.38 5.1L2 22l5.06-1.33A9.94 9.94 0 0 0 12.02 22C17.55 22 22 17.52 22 12S17.55 2 12.02 2Zm0 18.06c-1.6 0-3.13-.42-4.46-1.22l-.32-.19-3 .79.8-2.92-.21-.3A8.06 8.06 0 0 1 3.96 12c0-4.44 3.62-8.06 8.06-8.06 4.44 0 8.06 3.62 8.06 8.06 0 4.44-3.62 8.06-8.06 8.06Zm4.42-6.04c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.55.12-.16.24-.63.78-.77.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.8-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
      </svg>
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap font-display text-sm font-bold opacity-0 transition-all group-hover:max-w-xs group-hover:opacity-100 sm:inline-block">
        WhatsApp us
      </span>
    </a>
  );
}
