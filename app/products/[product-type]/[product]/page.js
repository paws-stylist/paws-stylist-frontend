import Homepage from '@/features/productpage/Homepage'

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  console.log({resolvedParams})
  return <Homepage params={resolvedParams} type="product" />
}