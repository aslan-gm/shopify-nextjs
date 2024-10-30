'use client'

import clsx from 'clsx'
import Image from 'next/image'

import { useCart } from '@/utils'

import styles from './cart-preview.module.scss'

export default function CartPreview() {
  const { isOpen, items, estimatedCost, checkoutUrl, removeItem } = useCart()

  if (!isOpen) return null

  const formatPrice = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  }

  return (
    <div className={styles['wrapper']}>
      <div className={styles['holder']}>
        {items.length === 0 ? (
          <div>Your cart is empty</div>
        ) : (
          <>
            <div>
              {items.map(node => (
                <div key={node.id} className={styles['item']}>
                  <button onClick={() => removeItem(node.id)} className={clsx(styles['remove-button'], 'btn-svg')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23 20.168l-8.185-8.187 8.185-8.174-2.832-2.807-8.182 8.179-8.176-8.179-2.81 2.81 8.186 8.196-8.186 8.184 2.81 2.81 8.203-8.192 8.18 8.192z" />
                    </svg>
                  </button>

                  <div className={styles['item-content']}>
                    <h6>{node.merchandise.product.title}</h6>
                    <p>{node.merchandise.title}</p>
                    <p>Qty: {node.quantity}</p>
                    <p>{formatPrice(node.merchandise.price.amount * node.quantity, node.merchandise.price.currencyCode)}</p>
                  </div>

                  {node.merchandise.image && (
                    <div className={styles['image']}>
                      <Image src={node.merchandise.image.url} alt={node.merchandise.image.altText} fill />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className={styles['total']}>
              <div className={styles['total-content']}>
                <span>Total:</span>
                <span>{formatPrice(estimatedCost.totalAmount.amount, estimatedCost.totalAmount.currencyCode)}</span>
              </div>

              <button onClick={() => (window.location.href = checkoutUrl)}>Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
