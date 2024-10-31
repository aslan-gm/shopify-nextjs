import Image from 'next/image'

import { ProductForm } from '@/components'
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
            <Image
              src={product.images.edges[0].node.url}
              width={product.images.edges[0].node.width}
              height={product.images.edges[0].node.height}
              alt={product.images.edges[0].node.altText || product.title}
              style={{ objectFit: 'contain' }}
              sizes="(min-width: 1024px) 25rem, 100vw"
            />
          </div>
        )}

        <p>{formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}</p>
        <div>{product.description}</div>
        <ProductForm variants={product.variants.edges} btnClassName={styles['btn']} />
      </div>
    </div>
  )
}
