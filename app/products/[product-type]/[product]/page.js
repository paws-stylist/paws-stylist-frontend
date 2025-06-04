import Homepage from '@/features/productpage/Homepage'

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  return <Homepage params={resolvedParams} type="product" />
}

// Nameservers
// ns1.mysecurecloudhost.com
// ns2.mysecurecloudhost.com
// ns3.mysecurecloudhost.com
// ns4.mysecurecloudhost.com