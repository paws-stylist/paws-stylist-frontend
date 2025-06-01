import Homepage from '@/features/productpage/Homepage'

export default async function ServicePage({ params }) {
  const resolvedParams = await params
  console.log('ServicePage resolvedParams:', resolvedParams)
  console.log('ServicePage params keys:', Object.keys(resolvedParams))
  return <Homepage params={resolvedParams} type="service" />
} 