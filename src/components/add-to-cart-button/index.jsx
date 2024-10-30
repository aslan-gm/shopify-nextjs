'use client'

import { useState } from 'react'

import { useCart } from '@/utils'

export default function AddToCartButton({ variantId, className = '' }) {
  const [isLoading, setIsLoading] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      await addItem(variantId, 1)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button onClick={handleAddToCart} disabled={isLoading} className={className}>
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  )
}
