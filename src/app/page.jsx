import Image from 'next/image'
import Link from 'next/link'

import { getAllProducts } from '@/utils'

import styles from './page.module.scss'

export default async function HomePage() {
  const { data } = await getAllProducts()

  const products =
    data?.products.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      description: node.description,
      handle: node.handle,
      price: node.priceRange.minVariantPrice.amount,
      currency: node.priceRange.minVariantPrice.currencyCode,
      imageUrl: node.images.edges[0]?.node.url,
      imageAlt: node.images.edges[0]?.node.altText,
    })) || []

  return (
    <div className={styles['wrapper']}>
      <div className="container">
        <h1 className={styles['title']}>Our Products</h1>

        <div className={styles['holder']}>
          {products.map(product => (
            <Link href={`/products/${product.handle}`} key={product.id} className={styles['item']}>
              {product.imageUrl && (
                <div className={styles['image']}>
                  <Image src={product.imageUrl} alt={product.imageAlt || product.title} fill />
                </div>
              )}

              <h5>{product.title}</h5>

              <p>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: product.currency,
                }).format(parseFloat(product.price))}
              </p>

              <p>{product.description}</p>
            </Link>
          ))}
        </div>

        {products.length === 0 && <p>No products available</p>}
      </div>
    </div>
  )
}
