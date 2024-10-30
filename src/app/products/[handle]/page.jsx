import Image from 'next/image'

import { AddToCartButton } from '@/components'
import { getProduct } from '@/utils'

import styles from './page.module.scss'

export default async function ProductPage({ params }) {
  const { handle } = await params
  const {
    body: { data },
  } = await getProduct(handle)

  const product = data.product

  if (!product) {
    return <div>Product not found</div>
  }

  const defaultVariant = product.variants.edges[0].node

  const formatPrice = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  }

  return (
    <div className={styles['wrapper']}>
      <div className="container">
        <h1 className={styles['title']}>{product.title}</h1>

        {product.images.edges[0] && (
          <div className={styles['image']}>
            <Image src={product.images.edges[0].node.url} fill alt={product.images.edges[0].node.altText || product.title} />
          </div>
        )}

        <p>{formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}</p>
        <div>{product.description}</div>

        {product.variants.edges.length > 1 && (
          <div>
            <h5>Available Options</h5>

            <select>
              {product.variants.edges.map(({ node }) => (
                <option key={node.id} value={node.id}>
                  {node.title} - {formatPrice(node.price.amount, node.price.currencyCode)}
                </option>
              ))}
            </select>
          </div>
        )}

        <AddToCartButton className={styles['btn']} variantId={defaultVariant.id} />
      </div>
    </div>
  )
}
