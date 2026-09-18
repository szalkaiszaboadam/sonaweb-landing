import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kapcsolat',
  description: 'Kérjen ingyenes ajánlatot a SONAWEB-től két perces kérdőívünk kitöltésével.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
