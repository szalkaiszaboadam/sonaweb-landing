import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Munkáink',
  description: 'Böngéssz végig minden projektünkön és ügyfelünkön, akikkel eddig dolgoztunk.',
}

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children
}
