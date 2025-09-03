"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  FacebookIcon, 
  TwitterIcon, 
  LinkedinIcon, 
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

const footerSections = {
  company: {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/projects", label: "Our Projects" },
      { href: "/services", label: "Services" },
      { href: "/contact", label: "Contact" },
    ],
  },
  services: {
    title: "Our Services",
    links: [
      { href: "/services#new-construction", label: "New Construction" },
      { href: "/services#renovations", label: "Home Renovations" },
      { href: "/services#extensions", label: "Extensions & Additions" },
      { href: "/services#commercial", label: "Commercial Projects" },
    ],
  },
  legal: {
    title: "Legal & Portal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/portal", label: "Workers Portal" },
    ],
  },
}

const socialLinks = [
  { href: "https://facebook.com", icon: FacebookIcon, label: "Facebook" },
  { href: "https://linkedin.com", icon: LinkedinIcon, label: "LinkedIn" },
  { href: "https://instagram.com", icon: InstagramIcon, label: "Instagram" },
]

export function Footer() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()
  
  // Don't render footer on admin pages
  if (pathname.startsWith('/admin')) {
    return null
  }
  
  return (
    <footer className="w-full border-t bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 relative">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Image 
                src="/Logo BG.PNG" 
                alt="Bayside Builders WA" 
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Quality construction services across Western Australia. 
              Building dreams with precision and excellence since 2010.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:info@baysidebuilderswa.com.au"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <MailIcon className="h-4 w-4" />
                info@baysidebuilderswa.com.au
              </a>
              <a
                href="tel:+61890001234"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <PhoneIcon className="h-4 w-4" />
                (08) 9000 1234
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPinIcon className="h-4 w-4" />
                Dunsborough, WA 6281
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key} className="space-y-4">
              <h4 className="text-sm font-semibold">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href as any}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Social Media Links */}
        <div className="flex justify-center items-center gap-4 mt-8 lg:mt-0 lg:justify-end">
          {socialLinks.map((social) => {
            const Icon = social.icon
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={social.label}
              >
                <Icon className="h-5 w-5" />
              </a>
            )
          })}
        </div>


        {/* Bottom Section */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Bayside Builders WA · Website built by{" "}
            <a 
              href="https://coastalprograms.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors underline"
            >
              Coastal Programs
            </a>
            {" "}· All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
