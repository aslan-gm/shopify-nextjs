'use client'

import { useState } from 'react'

import { useCart } from '@/utils'

export default function AddToCartButton({ variantId, className = '', availableForSale = false, quantity = null }) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const { addItem } = useCart()

  // New function to check if item is truly in stock
  const isInStock = () => {
    // If quantity tracking is disabled (quantity is null), rely on availableForSale
    if (quantity === null) return availableForSale

    // If quantity is being tracked, check both availability and quantity
    return availableForSale && quantity > 0
  }

  const handleAddToCart = async () => {
    if (!isInStock()) return

    setIsLoading(true)
    try {
      await addItem(variantId, selectedQuantity)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonText = () => {
    if (isLoading) return 'Adding...'

    if (!availableForSale) return 'Out of Stock'

    if (quantity === 0) return 'Out of Stock'

    // If quantity is null but availableForSale is true, consider it in stock
    if (quantity === null && availableForSale) return 'Add to Cart'

    return 'Add to Cart'
  }

  const getMaxQuantity = () => {
    return quantity
  }

  const isDisabled = isLoading || !isInStock()

  return (
    <div>
      <div>
        <button onClick={() => setSelectedQuantity(q => Math.max(1, q - 1))} disabled={isDisabled}>
          -
        </button>

        <input
          type="number"
          min="1"
          max={getMaxQuantity()}
          value={selectedQuantity}
          onChange={e => {
            const val = parseInt(e.target.value)

            if (isNaN(val)) return

            setSelectedQuantity(Math.min(getMaxQuantity(), Math.max(1, val)))
          }}
          disabled={isDisabled}
        />

        <button onClick={() => setSelectedQuantity(q => Math.min(getMaxQuantity(), q + 1))} disabled={isDisabled}>
          +
        </button>
      </div>

      <button onClick={handleAddToCart} disabled={isDisabled} className={className}>
        {getButtonText()}
      </button>
    </div>
  )
}
