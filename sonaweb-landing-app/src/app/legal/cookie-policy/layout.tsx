import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie tájékoztató',
  description: 'Tájékoztató a sonaweb.hu weboldalon használt sütikről.',
}

export default function CookiePolicyLayout({ children }: { children: React.ReactNode }) {
  return children
}
