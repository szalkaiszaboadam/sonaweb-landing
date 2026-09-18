import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adatkezelési tájékoztató',
  description: 'Tájékoztató a sonaweb.hu weboldalon megvalósuló adatkezelésekről a GDPR alapján.',
}

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children
}
