import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impresszum',
  description: 'A SONAWEB KFT. szolgáltatói és tárhelyszolgáltatói adatai.',
}

export default function ImprintLayout({ children }: { children: React.ReactNode }) {
  return children
}
