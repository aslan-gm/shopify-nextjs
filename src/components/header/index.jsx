import Link from 'next/link'

import { CartIcon } from '@/components'

import styles from './header.module.scss'

export default function Header() {
  return (
    <header className={'container'}>
      <div className={styles['holder']}>
        <Link href="/">Logo</Link>

        <nav>
          <Link href="/">Home</Link>
        </nav>

        <CartIcon />
      </div>
    </header>
  )
}
