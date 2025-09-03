"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"

const marketingNavItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
]

const inductionNavItems = [
  { href: "/portal", label: "Portal" },
  { href: "/induction/worker", label: "Induction" },
  { href: "/check-in", label: "Site Check-In" },
  { href: "/contact", label: "Contact" },
]

export function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(true)
  const [lastScrollY, setLastScrollY] = React.useState(0)
  
  // Determine if we're in the induction system
  const isInductionSystem = pathname.startsWith('/induction') || pathname.startsWith('/check-in') || pathname.startsWith('/portal')
  const navItems = isInductionSystem ? inductionNavItems : marketingNavItems
  
  // Check if we should use dark text (workers portal, sign in, induction form)
  const shouldUseDarkText = pathname.startsWith('/induction') || pathname.startsWith('/check-in') || pathname.startsWith('/login') || pathname.startsWith('/portal')

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

  // Don't render header on admin pages
  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        (isScrolled || shouldUseDarkText) ? "bg-white/95 backdrop-blur shadow-sm" : "bg-transparent",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="container flex h-16 items-center justify-center">
        {/* Centered Navigation Group */}
        <div className="hidden md:flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center mr-36">
            <Image 
              src="/Logo BG.PNG" 
              alt="Bayside Builders WA" 
              width={150}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Navigation Items */}
          <nav className="flex items-center">
            <div className="flex items-center gap-3">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(
                    "relative",
                    shouldUseDarkText || isScrolled ? "text-gray-700" : "text-white"
                  )}
                >
                  <Link href={item.href as any}>
                    {item.label}
                    {pathname === item.href && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </Link>
                </Button>
              ))}
            </div>
          </nav>
          
          {/* Right side button */}
          <div className="flex items-center">
          {isInductionSystem ? (
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Admin</Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/contact">Reach Out</Link>
            </Button>
          )}
        </div>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="ml-auto flex md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link href="/" className="flex items-center mb-6">
                  <Image 
                    src="/Logo BG.PNG" 
                    alt="Bayside Builders WA" 
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                  />
                </Link>
                <div className="flex flex-col gap-3">
                  {navItems.map((item) => (
                    <Button
                      key={item.href}
                      variant="ghost"
                      size="sm"
                      asChild
                      className={cn(
                        "w-full justify-start relative",
                        pathname === item.href && "bg-accent"
                      )}
                    >
                      <Link
                        href={item.href as any}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                        {pathname === item.href && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                      </Link>
                    </Button>
                  ))}
                </div>
                <div className="flex flex-col gap-2 mt-6 pt-6 border-t">
                  {isInductionSystem ? (
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        Admin
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                        Reach Out
                      </Link>
                    </Button>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
