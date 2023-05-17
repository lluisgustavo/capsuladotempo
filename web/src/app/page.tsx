import Link from 'next/link'
import Image from 'next/image'
import { User } from 'lucide-react'
import logo from '../assets/logo.svg'
import { Copyright } from '@/components/Copyright'

export default function Home() {
  return (
    <main className="grid min-h-screen grid-cols-2">
      {/* Left */}
      <div className="relative flex flex-col items-start justify-between overflow-hidden border-r-2 border-white/10 bg-[url(../assets/bg-stars.svg)] bg-cover px-28 py-16">
        {/* Blur */}
        <div className="absolute right-0 top-1/2 h-[288px] w-[526px] -translate-y-1/2 translate-x-1/2 rounded-full bg-orange-700 opacity-50 blur-full" />
        {/* Stripes */}
        <div className="absolute bottom-0 right-2 top-0 w-2 bg-stripes" />

        {/* Sign In */}
        <Link
          href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`}
          className="flex items-center gap-3 text-left transition-colors hover:text-orange-50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-400">
            <User className="h-5 w-5 text-gray-500"></User>
          </div>
          <p className="max-w-[140px] text-sm leading-snug">
            <span className="underline">Crie sua conta</span> e salve suas
            memórias!
          </p>
        </Link>

        {/* Hero */}
        <div className="space-y-5">
          <Image src={logo} alt="Logo"></Image>
          <div className="max-w-[420px] space-y-4">
            <h1 className="text-5xl font-bold leading-tight text-gray-50">
              Sua cápsula do tempo
            </h1>
            <p className="text-lg leading-relaxed">
              Colecione momentos marcantes da sua jornada e compartilhe (se
              quiser) com o mundo
            </p>
          </div>
          <Link
            href=""
            className="hover: inline-block rounded-full bg-yellow-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black transition-colors hover:bg-yellow-600"
          >
            Cadastrar Lembrança
          </Link>
        </div>

        <Copyright />
      </div>
      {/* Right */}
      <div className="flex flex-col items-center justify-center bg-[url(../assets/bg-stars.svg)] bg-cover">
        <div className="flex flex-1 items-center justify-center">
          <p className="w-[360px] text-center leading-relaxed">
            Você ainda não registrou nenhuma lembrança, comece a{' '}
            <Link href="" className="underline hover:text-orange-200">
              criar agora
            </Link>
            !
          </p>
        </div>
      </div>
    </main>
  )
}