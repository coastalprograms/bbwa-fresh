interface PageProps {
  params: { slug: string }
}

export default function ServiceTestPage({ params }: PageProps) {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Test Service: {params.slug}</h1>
      <p>This is a test outside the route group.</p>
    </div>
  )
}