import type { ReactElement } from "react";

interface AnnouncementCoverProps { seed: string }

const COVER_CLASSES = ["announcement-cover-0", "announcement-cover-1", "announcement-cover-2"];

export function AnnouncementCover({ seed }: AnnouncementCoverProps): ReactElement {
  const hash = Array.from(seed).reduce((value, letter) => Math.imul(value ^ letter.charCodeAt(0), 16777619), 2166136261);
  const variant = (hash >>> 0) % COVER_CLASSES.length;
  return (
    <div className={`announcement-cover ${COVER_CLASSES[variant]}`} aria-hidden="true">
      <svg viewBox="0 0 600 338" fill="none" className="h-full w-full">
        {variant === 0 && (
          <>
            <circle cx="310" cy="170" r="125" fill="#dce8d8" />
            <g transform="rotate(-9 300 170)">
              <rect x="167" y="55" width="248" height="228" rx="15" fill="#142d28" />
              <rect x="185" y="76" width="248" height="228" rx="15" fill="#fffef4" />
              <rect x="210" y="105" width="84" height="12" rx="6" fill="#bedc66" />
              <path d="M212 144h185M212 165h155M212 186h172" stroke="#a7b4a8" strokeWidth="8" strokeLinecap="round" />
              <rect x="210" y="215" width="87" height="57" rx="8" fill="#dfebc5" />
              <path d="m226 246 12 10 22-25" stroke="#284c39" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M320 230h77M320 250h55" stroke="#c2cbbd" strokeWidth="7" strokeLinecap="round" />
            </g>
            <circle cx="434" cy="84" r="34" fill="#d9ed8b" />
            <path d="M434 68v32M418 84h32" stroke="#284c39" strokeWidth="4" strokeLinecap="round" />
          </>
        )}
        {variant === 1 && (
          <>
            <circle cx="300" cy="175" r="127" stroke="#415873" strokeWidth="1" />
            <circle cx="300" cy="175" r="90" stroke="#415873" strokeWidth="1" />
            <path d="m175 105 125 70 119-74M300 175v114M175 250l125-75 140 63" stroke="#6885a5" strokeWidth="2" />
            <rect x="247" y="122" width="106" height="106" rx="27" fill="#d8e5f5" />
            <path d="M267 175h17l10-22 15 44 11-22h13" stroke="#233a56" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="175" cy="105" r="24" fill="#a9c4e5" /><circle cx="419" cy="101" r="30" fill="#7c9cc7" />
            <circle cx="175" cy="250" r="19" fill="#7c9cc7" /><circle cx="440" cy="238" r="23" fill="#d8e5f5" />
            <circle cx="300" cy="289" r="13" fill="#a9c4e5" />
          </>
        )}
        {variant === 2 && (
          <>
            <circle cx="304" cy="169" r="120" fill="#f0d39d" />
            <g transform="rotate(-12 300 170)">
              <path d="M208 151h91l106-62v165l-106-61h-91z" fill="#fffdf4" />
              <path d="M299 151v42l106 61V89z" fill="#efad52" />
              <rect x="190" y="145" width="37" height="55" rx="12" fill="#283d38" />
              <path d="m242 194 15 66h38l-19-66" fill="#283d38" />
              <path d="M429 141l29-13M432 176h33M426 210l27 15" stroke="#283d38" strokeWidth="7" strokeLinecap="round" />
            </g>
            <path d="m169 83 5 14 14 5-14 5-5 14-5-14-14-5 14-5z" fill="#c8812f" />
          </>
        )}
      </svg>
      <span className="cover-label">Team update</span>
    </div>
  );
}
