export default function Testimonials() {
  const items = [
    { name: 'Alex, Cottesloe', quote: 'Professional, on-time, and great quality.' },
    { name: 'Jess, Fremantle', quote: 'Clear communication and excellent workmanship.' },
    { name: 'Sam, Scarborough', quote: 'They transformed our home beyond expectations.' },
  ]
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((t) => (
        <figure key={t.name} className="rounded-lg border p-4 shadow-sm" itemScope itemType="https://schema.org/Review">
          <blockquote className="text-gray-100" itemProp="reviewBody">{t.quote}</blockquote>
          <figcaption className="mt-2 text-sm text-gray-300" itemProp="author">— {t.name}</figcaption>
        </figure>
      ))}
    </div>
  )
}
