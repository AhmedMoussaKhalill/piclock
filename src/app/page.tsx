import Hero from '@/components/hero'
import Image from 'next/image'

export default function Home() {
  return (
    <>
     <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
      <div className="flex flex-col items-center justify-center md:justify-start text-center my-20 gap-y-8 flex-1 px-6 pb-10">
        <Hero />
      </div>
      </div>
    </>
  )
}
