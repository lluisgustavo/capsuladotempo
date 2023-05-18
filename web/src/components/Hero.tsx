import Link from 'next/link'
import Image from 'next/image'
import logo from '../assets/logo.svg'

export function Hero() {
  return (
    <div className="space-y-5">
      <Image src={logo} alt="Logo"></Image>
      <div className="max-w-[420px] space-y-4">
        <h1 className="text-5xl font-bold leading-tight text-gray-50">
          Sua cápsula do tempo
        </h1>
        <p className="text-lg leading-relaxed">
          Colecione momentos marcantes da sua jornada e compartilhe (se quiser)
          com o mundo
        </p>
      </div>
      <Link
        href="/memories/new"
        className="hover: inline-block rounded-full bg-yellow-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black transition-colors hover:bg-yellow-600"
      >
        Cadastrar Lembrança
      </Link>
    </div>
  )
}
