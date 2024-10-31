'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useCallback, useState } from 'react'

import { useCart } from '@/utils'

import styles from './cart-preview.module.scss'

export default function CartPreview() {
  const { isOpen, items, estimatedCost, checkoutUrl, removeItem, updateItem } = useCart()
  const [updatingItems, setUpdatingItems] = useState({})
  const [localQuantities, setLocalQuantities] = useState({})

  const formatPrice = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  }

  const debounce = (func, wait) => {
    let timeout

    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  const updateCartItem = async (itemId, newQuantity, maxQuantity) => {
    if (newQuantity < 1 || (maxQuantity && newQuantity > maxQuantity)) return

    setUpdatingItems(prev => ({ ...prev, [itemId]: true }))
    try {
      await updateItem(itemId, newQuantity)
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }))
    }
  }

  const debouncedUpdateCartItem = useCallback(
    debounce((itemId, newQuantity, maxQuantity) => {
      updateCartItem(itemId, newQuantity, maxQuantity)
    }, 500),
    []
  )

  const handleQuantityChange = (itemId, newQuantity, maxQuantity) => {
    // More strict check for maximum quantity
    if (newQuantity < 1 || (maxQuantity !== null && maxQuantity !== undefined && newQuantity > maxQuantity)) return

    // Update local state immediately
    setLocalQuantities(prev => ({ ...prev, [itemId]: newQuantity }))
    // Debounce the API call
    debouncedUpdateCartItem(itemId, newQuantity, maxQuantity)
  }

  if (!isOpen) return null

  return (
    <div className={styles['wrapper']}>
      <div className={styles['holder']}>
        {items.length === 0 ? (
          <div>Your cart is empty</div>
        ) : (
          <>
            <div>
              {items.map(node => {
                const displayQuantity = localQuantities[node.id] ?? node.quantity
                const quantityAvailable = node.merchandise.quantityAvailable

                return (
                  <div key={node.id} className={styles['item']}>
                    <button
                      onClick={() => removeItem(node.id)}
                      className={clsx(styles['remove-button'], 'btn-svg')}
                      disabled={updatingItems[node.id]}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23 20.168l-8.185-8.187 8.185-8.174-2.832-2.807-8.182 8.179-8.176-8.179-2.81 2.81 8.186 8.196-8.186 8.184 2.81 2.81 8.203-8.192 8.18 8.192z" />
                      </svg>
                    </button>

                    <div className={styles['item-content']}>
                      <h6>{node.merchandise.title}</h6>

                      <div className={styles['quantity-controls']}>
                        <button
                          onClick={() => handleQuantityChange(node.id, displayQuantity - 1, quantityAvailable)}
                          disabled={updatingItems[node.id] || displayQuantity <= 1}>
                          -
                        </button>

                        <input
                          type="number"
                          min="1"
                          max={quantityAvailable}
                          value={displayQuantity}
                          onChange={e => {
                            const newQuantity = parseInt(e.target.value)

                            if (!isNaN(newQuantity)) {
                              handleQuantityChange(node.id, newQuantity, quantityAvailable)
                            }
                          }}
                        />

                        <button
                          onClick={() => handleQuantityChange(node.id, displayQuantity + 1, quantityAvailable)}
                          disabled={updatingItems[node.id] || (quantityAvailable && displayQuantity >= quantityAvailable)}>
                          +
                        </button>
                      </div>

                      <p>{formatPrice(node.merchandise.price.amount * displayQuantity, node.merchandise.price.currencyCode)}</p>
                    </div>

                    {node.merchandise.image && (
                      <div className={styles['image']}>
                        <Image src={node.merchandise.image.url} alt={node.merchandise.image.altText} fill />
                      </div>
                    )}
                  </div>
                )
              })}
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
