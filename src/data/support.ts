export type SupportFaq = {
  q: string
  a: string
}

export type SupportTopic = {
  heading: string
  body: string[]
}

export const SUPPORT_INTRO =
  'Support for The Isle Cheats buyers on theislecheats.cc — load, inject, Undetected status, HWID spoofer, menu setup, and delivery help after you purchase.'

export const SUPPORT_TOPICS: SupportTopic[] = [
  {
    heading: 'Before you open a support request',
    body: [
      'Confirm you bought The Isle Cheats from theislecheats.cc. We only support this product — not random downloads from elsewhere.',
      'Check live status on the product page. If it says Updating, do not inject. Wait for Undetected.',
      'Have your order email and build name ready. That speeds up help after EAC patches.',
    ],
  },
  {
    heading: 'Setup and load order',
    body: [
      'Follow the Complete Setup forum thread for the current load order, antivirus exclusions, menu configuration, and first clean inject.',
      'If the product is Updating, wait. If an Undetected build still fails after one clean retry, open a support request with your order ID and build name.',
    ],
  },
  {
    heading: 'HWID spoofer & ban recovery',
    body: [
      'Use the HWID spoofer only after a hardware ban, and only when Undetected status is live.',
      'Order: spoof → launch Evrima → inject The Isle Cheats → verify ESP. Spoofing into a detected build will not help.',
    ],
  },
  {
    heading: 'What we support',
    body: [
      'Supported: The Isle Evrima builds we sell — ESP, wallhack, radar, spoofer, menu, setup, and status questions.',
      'Horde help applies only when the current build lists Horde.',
      'Not supported: other games, cracked loaders, or third-party mirrors.',
    ],
  },
]

export const SUPPORT_FAQS: SupportFaq[] = [
  {
    q: 'How do I contact The Isle Cheats support?',
    a: 'Open your order on theislecheats.cc and use the checkout support channel tied to your purchase. Include a status screenshot (Undetected / Updating) and whether you need load, inject, or HWID spoofer help.',
  },
  {
    q: 'How to load The Isle Cheats after an Evrima patch?',
    a: 'Follow the Complete Setup forum thread for the current load order. If status is Updating, wait; if an Undetected build fails, include your order ID and build name in a support request.',
  },
  {
    q: 'Inject failed — what should I do?',
    a: 'Do not spam inject. Restart the game, confirm antivirus exclusions, re-check status, then try one clean inject. If it still fails, contact support with your build ID.',
  },
  {
    q: 'Do you help with setup and config?',
    a: 'Yes. Use the Complete Setup forum thread first, then contact support with your order ID if a current Undetected build still fails.',
  },
  {
    q: 'Is aimbot required?',
    a: 'No. The Isle Cheats lead with ESP and wallhack. Aim assist is optional. Support focuses on awareness features and safe load steps.',
  },
  {
    q: 'Where is the The Isle Cheats download?',
    a: 'Delivery is instant after checkout on theislecheats.cc. Use only that loader link. Third-party mirrors are unsupported and unsafe.',
  },
]
