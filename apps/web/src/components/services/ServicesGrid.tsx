import { Building2, ShowerHead, Home } from 'lucide-react'

const services = [
  { icon: Home, title: 'Extensions', desc: 'Add space and value to your home with quality extensions.' },
  { icon: ShowerHead, title: 'Bathrooms', desc: 'Modern bathroom renovations that elevate everyday living.' },
  { icon: Building2, title: 'Renovations', desc: 'From kitchens to living areas, we refresh your spaces.' },
]

export default function ServicesGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="rounded-lg border p-6 shadow-sm">
          <Icon className="h-8 w-8" aria-hidden />
          <h3 className="mt-4 text-lg font-medium">{title}</h3>
          <p className="mt-2 text-sm text-gray-100">{desc}</p>
        </div>
      ))}
    </div>
  )
}
