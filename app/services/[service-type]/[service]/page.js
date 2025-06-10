import Homepage from '@/features/productpage/Homepage'

export default async function ServicePage({ params }) {
  const resolvedParams = await params
  return <Homepage params={resolvedParams} type="service" />
} 