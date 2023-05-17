import Link from 'next/link'

export function Copyright() {
  return (
    <div className="text-sm leading-relaxed text-gray-200">
      Feito com 💜 no NLW da{' '}
      <Link
        target="_blank"
        rel="noreferrer"
        href="https://rocketseat.com.br"
        className="underline hover:text-gray-100"
      >
        Rocketseat
      </Link>
    </div>
  )
}
