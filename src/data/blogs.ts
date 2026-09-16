export type BlogSection = {
  heading: string
  body: string[]
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  metaTitle: string
  metaDescription: string
  searchTerms: string
  date: string
  readMinutes: number
  tag: string
  sections: BlogSection[]
}

/**
 * Commercial / transactional buyer guides only.
 * Forum-style: setup, antivirus, hotkeys, features, load, status — then buy.
 */
export const BLOGS: BlogPost[] = [
  {
    slug: 'features-list',
    title: 'The Isle Cheats Features List',
    excerpt:
      'Full features list before you buy The Isle Cheats — Entity ESP, World ESP, radar, hotkeys, stream-proof, and HWID spoofer.',
    metaTitle: 'Evrima ESP & Radar Feature List | Product Options',
    metaDescription:
      'Compare the Evrima Entity ESP, World ESP, radar, stream-proof and HWID spoofer features included before checkout.',
    searchTerms: 'features entity esp world esp radar stream-proof hwid spoofer',
    date: '2026-09-15',
    readMinutes: 6,
    tag: 'Features',
    sections: [
      {
        heading: 'What you get when you buy',
        body: [
          'The Isle Cheats is one product for The Isle (Evrima). You are buying a loader + license with live Undetected / Updating status on theislecheats.cc — not a random multi-game pack.',
          'Open the product page, confirm status, then checkout. Delivery is instant on supported builds.',
        ],
      },
      {
        heading: 'Features list',
        body: [
          'Entity ESP / wallhack — players and dinos through fog (distance, growth, health when the build supports it).',
          'World ESP — food, water, corpses, and survival props.',
          '2D radar — map-style awareness next to ESP.',
          'Stream-proof — hide overlays from capture when you clip or go live.',
          'HWID spoofer — for hardware bans only; run before you inject, and only when status is Undetected.',
          'Optional aim assist — off by default; most buyers want ESP and radar first.',
        ],
      },
      {
        heading: 'Next step',
        body: [
          'Read the hotkeys and setup guides, then buy The Isle Cheats when status is Undetected.',
        ],
      },
    ],
  },
  {
    slug: 'hotkeys',
    title: 'The Isle Cheats Hotkeys',
    excerpt:
      'Hotkeys and menu keys for The Isle Cheats after inject — open menu, toggles, and what to leave unbound.',
    metaTitle: 'Evrima ESP Menu Hotkeys | Post-Checkout Setup',
    metaDescription:
      'Hotkeys for The Isle Cheats after you buy and inject: open menu, ESP toggles, radar, stream-proof. Simple key list for Evrima.',
    searchTerms: 'hotkeys menu keys esp toggle radar stream-proof',
    date: '2026-09-15',
    readMinutes: 4,
    tag: 'Hotkeys',
    sections: [
      {
        heading: 'After inject',
        body: [
          'Buy The Isle Cheats, check Undetected, load the game, run the loader, wait for a clean inject. Then open the menu with the key listed in your delivery notes (build-specific).',
          'If the menu does not open, do not spam keys — reopen support with your order ID and build name.',
        ],
      },
      {
        heading: 'Typical hotkey jobs',
        body: [
          'Menu open / close — always learn this first.',
          'ESP master toggle — turn Entity ESP on/off without digging panels.',
          'Radar toggle — same idea for the 2D radar.',
          'Stream-proof — flip before you start OBS or clips.',
          'Panic / unload (if your build ships it) — use only when you need a hard stop.',
        ],
      },
      {
        heading: 'Keep it simple',
        body: [
          'Bind only what you use. Extra binds get pressed mid-fight and look obvious. Save your layout once, then re-check status after every Evrima patch before you inject again.',
        ],
      },
    ],
  },
  {
    slug: 'complete-setup',
    title: 'How to Complete The Isle Cheats Setup',
    excerpt:
      'Complete setup for The Isle Cheats: buy, disable blockers, load Evrima, inject, enable ESP, confirm hotkeys.',
    metaTitle: 'Complete Evrima Loader Setup & Inject Order',
    metaDescription:
      'Complete setup after checkout: delivery checklist, antivirus exclusions, Evrima load order, inject troubleshooting, ESP configuration and hotkeys.',
    searchTerms: 'complete setup instructions load inject checklist loader order',
    date: '2026-09-15',
    readMinutes: 7,
    tag: 'Setup',
    sections: [
      {
        heading: '1) Buy and confirm status',
        body: [
          'Open Buy The Isle Cheats on theislecheats.cc. If status is Updating, wait. If Undetected, checkout and use only the official delivery link (theisle cheats / isle cheats from this site only).',
        ],
      },
      {
        heading: '2) Prep the PC',
        body: [
          'Close overlays that fight injectors (Discord overlay, GeForce, RGB suites if they hook games).',
          'Follow the antivirus guide: allowlist the loader folder or pause real-time scan for the install window — see Disable Antivirus.',
          'Do not run cracked mirrors. Support only covers loaders delivered with your order.',
        ],
      },
      {
        heading: '3) Load order',
        body: [
          'Start The Isle (Evrima).',
          'Run the The Isle Cheats loader / license as delivered.',
          'Wait for successful inject.',
          'Open the menu → Entity ESP on → World ESP on → radar on → stream-proof if you record.',
          'Aim assist off unless you specifically want it. HWID spoofer only after a hardware ban.',
        ],
      },
      {
        heading: '4) Save and re-check after patches',
        body: [
          'Save the config. After any Evrima / EAC update, check Undetected again before you inject. Setup means nothing on a detected build.',
        ],
      },
      {
        heading: '5) Quick checklist',
        body: [
          'Save the delivered loader folder and license details before starting.',
          'Allowlist the delivery folder, close conflicting overlays, and read the current menu key.',
          'Use the HWID spoofer first only if you are recovering from a hardware ban.',
        ],
      },
      {
        heading: '6) If inject fails',
        body: [
          'Stop and re-check Undetected versus Updating. Restart the game once, confirm antivirus exclusions, and attempt one clean load.',
          'If it still fails, contact support with the order ID and current build. Do not force an outdated loader into an updated game.',
        ],
      },
    ],
  },
  {
    slug: 'disable-antivirus',
    title: 'How to Turn Off Antivirus for The Isle Cheats',
    excerpt:
      'Turn off or allowlist antivirus so The Isle Cheats loader can run after purchase — Windows Defender and common AV steps.',
    metaTitle: 'Evrima Loader Antivirus Exclusions | Windows Defender',
    metaDescription:
      'How to turn off or allowlist antivirus for The Isle Cheats after you buy — Defender exclusions, false positives, then inject on Undetected.',
    searchTerms: 'disable antivirus defender exclusion allowlist loader false positive',
    date: '2026-09-15',
    readMinutes: 5,
    tag: 'Antivirus',
    sections: [
      {
        heading: 'Why this step exists',
        body: [
          'Cheat loaders are often flagged as generic “trojan” heuristics even when you bought The Isle Cheats from theislecheats.cc. That blocks inject. Fix the AV step before you spam the loader.',
        ],
      },
      {
        heading: 'Windows Defender (common path)',
        body: [
          'Open Windows Security → Virus & threat protection → Manage settings.',
          'Add an exclusion for the folder that holds your official The Isle Cheats loader (the path from your delivery email).',
          'If the file was already quarantined, restore it from Protection history, then exclude the folder.',
          'Optional short window: pause real-time protection only while you inject, then turn it back on. Prefer a permanent exclusion for the delivery folder over leaving Defender off all day.',
        ],
      },
      {
        heading: 'Third-party AV',
        body: [
          'Same idea: exclusion / allowlist for the loader folder, not “turn off forever.” Norton, Avast, Bitdefender, Malwarebytes — use their exclusion UI.',
          'If inject still fails after exclusion, restart the PC once, confirm Undetected status, then try one clean inject. Open support with your order ID if it still fails.',
        ],
      },
      {
        heading: 'Then continue setup',
        body: [
          'When the exclusion is ready, follow Complete Setup for the load order and troubleshooting steps. Support can match only official orders and current builds.',
        ],
      },
    ],
  },
  {
    slug: 'undetected-status',
    title: 'Check Undetected Before You Buy or Inject',
    excerpt:
      'Undetected vs Updating for The Isle Cheats — check status before checkout and before every inject after an Evrima patch.',
    metaTitle: 'Evrima Loader Status | Undetected or Updating',
    metaDescription:
      'Check the current Undetected or Updating state before checkout and before loading after an Evrima or EAC patch.',
    searchTerms: 'undetected status updating eac patch inject checkout',
    date: '2026-09-15',
    readMinutes: 4,
    tag: 'Status',
    sections: [
      {
        heading: 'Status is part of the purchase',
        body: [
          'Do not buy or inject blind. The product page shows Undetected or Updating after Evrima / EAC patches. That status is the go / no-go for The Isle Cheats.',
        ],
      },
      {
        heading: 'Undetected vs Updating',
        body: [
          'Undetected — current build is cleared for load. Safe to checkout and inject.',
          'Updating — wait. Do not trust old Discord “still UD” screenshots. Spoofing does not make a detected build safe.',
        ],
      },
      {
        heading: 'After a ban',
        body: [
          'Use the HWID spoofer only when status is Undetected again, then load. Open Support if you need the recovery order of operations.',
        ],
      },
    ],
  },
]

export function getBlog(slug: string) {
  return BLOGS.find((b) => b.slug === slug)
}

export { blogPath } from './blog-paths'
