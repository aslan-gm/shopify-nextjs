import { create } from 'zustand'

import { shopifyFetch } from '@/utils'

export const useCart = create((set, get) => ({
  isOpen: false,
  itemCount: 0,
  items: [],
  cartId: null,
  checkoutUrl: null,
  estimatedCost: null,

  setIsOpen: isOpen => set({ isOpen }),

  initializeCart: async () => {
    const cartId = localStorage.getItem('cartId')

    if (cartId) {
      try {
        // Fetch existing cart data
        const {
          body: { data },
        } = await shopifyFetch({
          query: `
            query GetCart($cartId: ID!) {
              cart(id: $cartId) {
                id
                checkoutUrl
                lines(first: 100) {
                  edges {
                    node {
                      id
                      quantity
                      merchandise {
                        ... on ProductVariant {
                          id
                          title
                          price {
                            amount
                            currencyCode
                          }
                          image {
                            url
                            altText
                          }
                          product {
                            title
                          }
                        }
                      }
                    }
                  }
                }
                estimatedCost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          `,
          variables: { cartId },
        })

        if (data?.cart) {
          const items = data.cart.lines.edges.map(({ node }) => node)
          const itemCount = items.reduce((total, item) => total + item.quantity, 0)

          set({
            cartId,
            items,
            itemCount,
            checkoutUrl: data.cart.checkoutUrl,
            estimatedCost: data.cart.estimatedCost,
          })
        }
      } catch (error) {
        console.error('Error initializing cart:', error)
        // If there's an error (like invalid cartId), clear localStorage
        localStorage.removeItem('cartId')
      }
    }
  },

  addItem: async (variantId, quantity = 1) => {
    try {
      let { cartId } = get()

      if (!cartId) {
        const {
          body: { data },
        } = await shopifyFetch({
          query: `
            mutation CreateCart {
              cartCreate {
                cart {
                  id
                  checkoutUrl
                }
              }
            }
          `,
        })

        cartId = data.cartCreate.cart.id
        localStorage.setItem('cartId', cartId)
        set({
          cartId,
          checkoutUrl: data.cartCreate.cart.checkoutUrl,
        })
      }

      const {
        body: { data },
      } = await shopifyFetch({
        query: `
          mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
              cart {
                id
                checkoutUrl
                lines(first: 100) {
                  edges {
                    node {
                      id
                      quantity
                      merchandise {
                        ... on ProductVariant {
                          id
                          title
                          price {
                            amount
                            currencyCode
                          }
                          image {
                            url
                            altText
                          }
                          product {
                            title
                          }
                        }
                      }
                    }
                  }
                }
                estimatedCost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        `,
        variables: {
          cartId,
          lines: [
            {
              merchandiseId: variantId,
              quantity,
            },
          ],
        },
      })

      const cart = data.cartLinesAdd.cart
      const items = cart.lines.edges.map(({ node }) => node)
      const itemCount = items.reduce((total, item) => total + item.quantity, 0)

      set({
        items,
        itemCount,
        isOpen: true,
        checkoutUrl: cart.checkoutUrl,
        estimatedCost: cart.estimatedCost,
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  },

  removeItem: async lineId => {
    try {
      const { cartId } = get()

      const {
        body: { data },
      } = await shopifyFetch({
        query: `
          mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
            cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
              cart {
                id
                checkoutUrl
                lines(first: 100) {
                  edges {
                    node {
                      id
                      quantity
                      merchandise {
                        ... on ProductVariant {
                          id
                          title
                          price {
                            amount
                            currencyCode
                          }
                          image {
                            url
                            altText
                          }
                          product {
                            title
                          }
                        }
                      }
                    }
                  }
                }
                estimatedCost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        `,
        variables: {
          cartId,
          lineIds: [lineId],
        },
      })

      const cart = data.cartLinesRemove.cart
      const items = cart.lines.edges.map(({ node }) => node)
      const itemCount = items.reduce((total, item) => total + item.quantity, 0)

      set({
        items,
        itemCount,
        checkoutUrl: cart.checkoutUrl,
        estimatedCost: cart.estimatedCost,
      })
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  },
}))
