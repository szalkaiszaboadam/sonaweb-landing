'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Footer } from '@/components/footer'
import { useLoaderReady } from '@/components/loader'

// FIREBASE IMPORTOK
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { getDb } from '@/lib/firebase'

const CONTAINER = 'mx-auto w-full max-w-[1340px] px-6'

// A cikkek típusának meghatározása
interface BlogPost {
  id: string
  title: string
  slug: string
  category: string
  date: string
  image: string
}

export default function BlogPage() {
  const isReady = useLoaderReady()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)

  const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1]

  // ADATOK LEKÉRÉSE A FIREBASE-BŐL
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(getDb(), 'posts'), orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)
        
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BlogPost[]
        
        setPosts(fetchedPosts)
      } catch (error) {
        console.error("Hiba a cikkek lekérésekor: ", error)
      } finally {
        setIsLoadingPosts(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <main className="min-h-screen bg-[#0A0A0A] font-inter text-[#F4F2F0] selection:bg-[#BF2234] selection:text-[#F4F2F0]">
      
      {/* ── FEJLÉC ── */}
      <section className="relative w-full pt-40 pb-16 md:pt-52 md:pb-24" data-theme="dark">
        <div className={`${CONTAINER} flex flex-col items-center text-center`}>
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: EASING }}
            className="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[1.05] tracking-[-0.02em] text-[#F4F2F0]"
          >
            Digitális <br className="hidden md:block" /> Tudástár
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASING }}
            className="mt-6 max-w-2xl text-lg font-medium text-[#9E9A98] md:text-xl"
          >
            Adatvezérelt stratégiák, prémium design megoldások és technikai mélyvíz. Gondolatok és esettanulmányok egyenesen a csapatunktól.
          </motion.p>
        </div>
      </section>

      {/* ── BLOG BEJEGYZÉSEK RÁCSA ── */}
      <section className="w-full pb-32 md:pb-48" data-theme="dark">
        <div className={CONTAINER}>
{isLoadingPosts ? (
            <div className="flex w-full items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1A1A1A] border-t-[#BF2234]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-12 gap-y-20 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {posts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    // A MÁGIA: Az `isReady` változóhoz kötjük az animációt!
                    initial={{ opacity: 0, y: 50 }}
                    animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    // Egy kis extra késleltetés (0.2s), hogy a cím után ússzanak be
                    transition={{ duration: 0.8, delay: 0.2 + (index * 0.15), ease: EASING }} 
                    className="group flex flex-col"
                  >
                    <Link href={`/blog/${post.slug}`} className="flex flex-col gap-6">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-[#141414] md:aspect-[16/10]">
                        <Image src={post.image || '/placeholder.svg'} alt={post.title} fill className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
                        <div className="absolute inset-0 bg-[#0A0A0A]/0 transition-colors duration-500 group-hover:bg-[#0A0A0A]/20" />
                      </div>

                      <div className="flex flex-col px-2">
                        <div className="mb-4 flex items-center gap-3 font-inter text-[11px] font-bold uppercase tracking-widest text-[#5A5755]">
                          <span className="text-[#BF2234]">{post.category}</span>
                          <span className="h-1 w-1 rounded-full bg-[#333]"></span>
                          <span>{post.date}</span>
                        </div>
                        
                        <div className="flex items-start justify-between gap-4">
                          <h2 className="font-display text-xl font-bold leading-tight tracking-tight text-[#F4F2F0] transition-colors group-hover:text-[#F4F2F0] md:text-2xl">
                            {post.title}
                          </h2>
                          
                          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#1A1A1A] bg-[#141414] text-[#F4F2F0] transition-all duration-300 group-hover:border-[#BF2234] group-hover:bg-[#BF2234]">
                            <ArrowRight className="h-4 w-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
