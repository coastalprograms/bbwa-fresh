"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  HomeIcon, 
  BuildingIcon, 
  UsersIcon, 
  PhoneIcon, 
  MapPinIcon,
  MenuIcon,
  XIcon,
  ClipboardCheckIcon
} from "lucide-react"


export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(true)
  const [lastScrollY, setLastScrollY] = React.useState(0)
  
  // Check if we're in the workers portal section
  const isWorkersPortal = pathname.startsWith('/induction')
  
  // Determine logo destination based on current section
  const logoHref = isWorkersPortal ? '/induction/worker' : '/'

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show/hide based on scroll direction
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        // Scrolling up or at top
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsVisible(false)
      }
      
      setIsScrolled(currentScrollY > 10)
      setLastScrollY(currentScrollY)
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-white/95 backdrop-blur shadow-sm" : "bg-transparent",
      isVisible ? "translate-y-0" : "-translate-y-full"
    )}>
      <nav className="container flex h-24 items-center">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href={logoHref} className="flex items-center space-x-4">
            <Image 
              src="/logo BG.png" 
              alt="Bayside Builders WA" 
              width={64}
              height={64}
              className="h-16 w-auto"
            />
            <span className={cn(
              "text-5xl font-bold transition-colors",
              isScrolled ? "text-gray-900" : "text-white drop-shadow-lg"
            )}>Bayside Builders WA</span>
          </Link>
        </div>

        {/* Desktop Navigation - Left aligned */}
        <div className="hidden md:flex flex-1 ml-8 items-center gap-2">
          <Button variant="ghost" asChild className={cn(
            "relative",
            isScrolled ? "text-gray-700" : "text-white"
          )}>
            <Link href="/">
              <HomeIcon className="mr-2 h-4 w-4" />
              Home
              {pathname === "/" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Link>
          </Button>

          <Button variant="ghost" asChild className={cn(
            "relative",
            isScrolled ? "text-gray-700" : "text-white"
          )}>
            <Link href="/about">
              <UsersIcon className="mr-2 h-4 w-4" />
              About
              {pathname === "/about" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Link>
          </Button>

          <Button variant="ghost" asChild className={cn(
            "relative",
            isScrolled ? "text-gray-700" : "text-white"
          )}>
            <Link href="/services">
              <BuildingIcon className="mr-2 h-4 w-4" />
              Services
              {pathname === "/services" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Link>
          </Button>

          <Button variant="ghost" asChild className={cn(
            "relative",
            isScrolled ? "text-gray-700" : "text-white"
          )}>
            <Link href="/projects">
              <BuildingIcon className="mr-2 h-4 w-4" />
              Projects
              {pathname === "/projects" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Link>
          </Button>

          <Button variant="ghost" asChild className={cn(
            "relative",
            isScrolled ? "text-gray-700" : "text-white"
          )}>
            <Link href="/contact">
              <PhoneIcon className="mr-2 h-4 w-4" />
              Contact
              {pathname === "/contact" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Link>
          </Button>

          <Button variant="ghost" asChild className={cn(
            "relative",
            isScrolled ? "text-gray-700" : "text-white"
          )}>
            <Link href="/induction/worker">
              <ClipboardCheckIcon className="mr-2 h-4 w-4" />
              Worker Induction
              {pathname.startsWith("/induction") && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Link>
          </Button>
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex flex-shrink-0 items-center space-x-4">
          <Button asChild>
            <Link href="/contact">Reach Out</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden ml-auto"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur">
          <div className="container py-4 space-y-2">
            <a
              href="/"
              className={cn(
                "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/" && "bg-accent"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <HomeIcon className="h-4 w-4" />
              <span>Home</span>
            </a>
            
            <a
              href="/services"
              className={cn(
                "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/services" && "bg-accent"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <BuildingIcon className="h-4 w-4" />
              <span>Services</span>
            </a>

            <a
              href="/projects"
              className={cn(
                "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/projects" && "bg-accent"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <BuildingIcon className="h-4 w-4" />
              <span>Projects</span>
            </a>

            <a
              href="/about"
              className={cn(
                "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/about" && "bg-accent"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <UsersIcon className="h-4 w-4" />
              <span>About</span>
            </a>

            <a
              href="/contact"
              className={cn(
                "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/contact" && "bg-accent"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <PhoneIcon className="h-4 w-4" />
              <span>Contact</span>
            </a>

            <a
              href="/induction/worker"
              className={cn(
                "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/induction") && "bg-accent"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <ClipboardCheckIcon className="h-4 w-4" />
              <span>Worker Induction</span>
            </a>

            <div className="pt-4">
              <Button asChild className="w-full">
                <Link href="/contact">Reach Out</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

