'use client'

import { useState } from 'react'

import { AddToCartButton } from '@/components'

export default function ProductForm({ variants, btnClassName }) {
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0].node.id)

  // Find the currently selected variant
  const selectedVariant = variants.find(({ node }) => node.id === selectedVariantId)?.node

  const formatPrice = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  }

  return (
    <div>
      {variants.length > 1 && (
        <div>
          <h5>Available Options</h5>

          <select value={selectedVariantId} onChange={e => setSelectedVariantId(e.target.value)}>
            {variants.map(({ node }) => (
              <option key={node.id} value={node.id} disabled={!node.availableForSale}>
                {node.title} - {formatPrice(node.price.amount, node.price.currencyCode)}
                {!node.availableForSale && ' (Out of Stock)'}
              </option>
            ))}
          </select>
        </div>
      )}

      <AddToCartButton
        className={btnClassName}
        variantId={selectedVariant.id}
        availableForSale={selectedVariant.availableForSale}
        quantity={selectedVariant.quantityAvailable}
      />
    </div>
  )
}
