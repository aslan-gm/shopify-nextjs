'use client'

import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { CartPreview } from '@/components'
import { useCart } from '@/utils'

import styles from './cart-icon.module.scss'

export default function CartIcon() {
  const { itemCount, isOpen, setIsOpen } = useCart()
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <>
      <div className={styles['wrapper']}>
        <button onClick={() => setIsOpen(!isOpen)} className={clsx(styles['cart-icon'], 'btn-svg')}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 19.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5zm3.5-1.5c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm6.304-15l-3.431 12h-2.102l2.542-9h-16.813l4.615 11h13.239l3.474-12h1.929l.743-2h-4.196z" />
          </svg>

          {itemCount > 0 && <span>{itemCount}</span>}
        </button>

        <div className={styles['inner']}>
          <CartPreview />
        </div>
      </div>
    </>
  )
}
