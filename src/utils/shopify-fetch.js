export async function shopifyFetch({ query, variables }) {
  const endpoint = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  const key = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    // Log the raw response for debugging
    const rawResponse = await result.text()

    // Try to parse as JSON
    let jsonResponse

    try {
      jsonResponse = JSON.parse(rawResponse)
    } catch (e) {
      console.error('Failed to parse response as JSON:', e)
      throw new Error(`Invalid JSON response: ${rawResponse}`)
    }

    if (!result.ok) {
      console.error('API Response Error:', {
        status: result.status,
        statusText: result.statusText,
        body: jsonResponse,
      })
      throw new Error(`Shopify API error: ${result.status}`)
    }

    return {
      status: result.status,
      body: jsonResponse,
    }
  } catch (error) {
    console.error('Shopify fetch error:', error)
    throw error
  }
}
