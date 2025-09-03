export default function CoreValues() {
  const values = [
    { title: 'Quality', desc: 'We deliver workmanship that stands the test of time.' },
    { title: 'Reliability', desc: 'Clear schedules and dependable delivery.' },
    { title: 'Safety', desc: 'We maintain safe sites and practices.' },
    { title: 'Transparency', desc: 'Open communication and clear pricing.' },
  ]
  return (
    <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {values.map((v) => (
        <div key={v.title} className="rounded-lg border p-6 shadow-sm">
          <dt className="font-medium">{v.title}</dt>
          <dd className="mt-2 text-sm text-gray-100">{v.desc}</dd>
        </div>
      ))}
    </dl>
  )
}
