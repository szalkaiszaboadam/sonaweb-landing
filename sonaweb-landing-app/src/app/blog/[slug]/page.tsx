'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { getDb } from '@/lib/firebase'
import { Footer } from '@/components/footer'
import { ArrowLeft } from 'lucide-react'
import { useLoaderReady } from '@/components/loader'

export default function BlogPostReader() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Ezzel az oldal betöltése is elegáns lesz!
  const isReady = useLoaderReady()
  const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1]

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const q = query(collection(getDb(), 'posts'), where('slug', '==', slug))
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          setPost({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() })
        }
      } catch (error) {
        console.error("Hiba a lekéréskor", error)
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1A1A1A] border-t-[#BF2234]" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] text-[#F4F2F0]">
        <h1 className="font-display text-4xl font-bold mb-4">A cikk nem található</h1>
        <Link href="/blog" className="text-[#BF2234] underline underline-offset-4">Vissza a blogra</Link>
      </div>
    )
  }

return (
    <main className="min-h-screen bg-[#0A0A0A] font-inter text-[#F4F2F0] selection:bg-[#BF2234] selection:text-[#F4F2F0]">
      
      <article className="pb-24 pt-32 md:pt-40">
        
        {/* ── 1. VISSZA GOMB ÉS FEJLÉC (Visszatéve BALRA, a szöveggel egy vonalba!) ── */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: EASING }}
          // Itt vettem ki a text-centert, és állítottam be a 800px-es szélességet!
          className="mx-auto w-full max-w-[800px] px-6"
        >
          <Link href="/blog" className="group mb-12 inline-flex items-center gap-3 text-sm font-bold text-[#9E9A98] transition-colors hover:text-[#F4F2F0]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#141414] transition-colors group-hover:bg-[#BF2234]">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Vissza a Tudástárba
          </Link>

          <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#9E9A98]">
            <span className="text-[#BF2234]">{post.category}</span>
            <span className="h-1 w-1 rounded-full bg-[#333]"></span>
            <span>{post.date}</span>
          </div>

          <h1 className="mb-12 font-display text-[clamp(2.5rem,6vw,5.5rem)] font-black leading-[1.05] tracking-tight text-[#F4F2F0]">
            {post.title}
          </h1>
        </motion.div>

        {/* ── 2. CIKK KÉPE (Szélesség lecsökkentve 800px-re, egy vonalban a szöveggel) ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASING }}
          className="mx-auto w-full max-w-[800px] px-6 mb-16 md:mb-24"
        >
          <div className="relative h-[250px] w-full overflow-hidden rounded-3xl bg-[#141414] md:h-[350px]">
            <Image 
              src={post.image || '/placeholder.svg'} 
              alt={post.title} 
              fill 
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 rounded-3xl border border-[#222]/50" />
          </div>
        </motion.div>

        {/* ── 3. CIKK TÖRZSE ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASING }}
          className="mx-auto w-full max-w-[800px] px-6"
        >
          <div 
            className="prose prose-invert max-w-none text-[#9E9A98]
              [&>p]:mb-10 [&>p]:leading-[1.8] [&>p]:text-[1.15rem] md:[&>p]:text-[1.35rem]
              [&>h1]:mt-20 [&>h1]:mb-8 [&>h1]:font-display [&>h1]:text-4xl md:[&>h1]:text-5xl [&>h1]:font-black [&>h1]:text-[#F4F2F0] [&>h1]:tracking-tight
              [&>h2]:mt-16 [&>h2]:mb-6 [&>h2]:font-display [&>h2]:text-3xl md:[&>h2]:text-4xl [&>h2]:font-bold [&>h2]:text-[#F4F2F0] [&>h2]:tracking-tight
              [&>h3]:mt-12 [&>h3]:mb-4 [&>h3]:font-display [&>h3]:text-2xl md:[&>h3]:text-3xl [&>h3]:font-bold [&>h3]:text-[#F4F2F0]
              [&>ul]:mb-10 [&>ul]:list-inside [&>ul]:list-disc [&>ul]:pl-4 [&>ul>li]:mb-4 [&>ul>li]:text-[1.15rem] md:[&>ul>li]:text-[1.35rem]
              [&>ol]:mb-10 [&>ol]:list-inside [&>ol]:list-decimal [&>ol]:pl-4 [&>ol>li]:mb-4 [&>ol>li]:text-[1.15rem] md:[&>ol>li]:text-[1.35rem]
              [&>blockquote]:mb-12 [&>blockquote]:mt-12 [&>blockquote]:border-l-4 [&>blockquote]:border-[#BF2234] [&>blockquote]:pl-6 [&>blockquote]:font-display [&>blockquote]:text-[1.5rem] md:[&>blockquote]:text-[1.8rem] [&>blockquote]:italic [&>blockquote]:text-[#F4F2F0]
              [&>a]:font-bold [&>a]:text-[#BF2234] [&>a]:underline [&>a]:underline-offset-4 [&>a]:transition-colors hover:[&>a]:text-[#F4F2F0]
              [&_img]:rounded-3xl [&_img]:border [&_img]:border-[#222] [&_img]:shadow-2xl [&_img]:my-16 [&_img]:w-full [&_img]:object-cover"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>
      </article>

      {/* ── 4. KAPCSOLAT KÁRTYA ── */}
      <section className="relative z-10 w-full px-4 pb-20 md:px-6">
        <div className="mx-auto flex w-full max-w-[1340px] flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-[#F4F2F0] px-6 py-20 text-center md:rounded-[3rem] md:py-32">
          
          <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-black uppercase leading-[1.05] tracking-tight text-[#0A0A0A]">
            Tetszett amit olvastál?
          </h2>
          <p className="mt-6 max-w-xl font-inter text-base font-medium text-[#5A5755] md:text-lg">
            Beszéljük át, hogyan tudjuk ezeket a stratégiákat a te üzleted növekedésére fordítani.
          </p>
          
          <div className="mt-10">
            <Link href="/start" className="inline-flex items-center justify-center rounded-full bg-[#BF2234] px-10 py-5 font-inter text-base font-bold tracking-wide text-[#F4F2F0] hover:scale-105 transition-all shadow-xl shadow-[#BF2234]/20">
               Mondd el a céljaidat
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
