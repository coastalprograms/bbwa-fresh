import { Metadata } from 'next'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactForm } from '@/components/forms/ContactForm'
import { HeroSection } from "@/components/sections/hero-section"
import { 
  MailIcon, 
  PhoneIcon, 
  MapPinIcon, 
  ClockIcon,
  SparklesIcon,
  MessageSquareIcon,
  GlobeIcon,
  LinkedinIcon,
  TwitterIcon,
  GithubIcon,
  FacebookIcon,
  InstagramIcon
} from "lucide-react"

export const metadata: Metadata = {
  title: 'Contact Us - Free Construction Quote Dunsborough | Bayside Builders WA',
  description: 'Contact the South West\'s trusted builders for a free quote. Call (08) 9000 1234 or send a message. Licensed builders ready to discuss your construction, renovation, or extension project.',
  keywords: ['contact Dunsborough builders', 'free quote construction South West', 'Dunsborough builders phone', 'construction quote Western Australia', 'licensed builders contact', 'renovation quote South West'],
  openGraph: {
    title: 'Contact Bayside Builders WA - Free Construction Quote Dunsborough',
    description: 'Get a free quote from the South West\'s trusted builders. Licensed professionals ready to discuss your construction project.',
    images: [
      {
        url: '/images/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Bayside Builders WA - Free Construction Quote',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Bayside Builders WA - Free Construction Quote Dunsborough',
    description: 'Get a free quote from the South West\'s licensed builders. Call or message us today!',
    images: ['/images/twitter-contact.jpg'],
  },
}

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection
        title="Get In Touch"
        subtitle="Ready to Start Your Project?"
        description="Contact the South West's trusted construction professionals for a free consultation and quote. We're here to help bring your vision to life."
        badge="Free Consultation & Quote"
        primaryCta={{
          text: "Call Now",
          href: "tel:+61890001234"
        }}
        secondaryCta={{
          text: "Send Message",
          href: "#contact-form"
        }}
        showCarousel={true}
      />

      {/* Contact Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-6xl">

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Contact Information */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="hover:shadow-lg transition-all duration-300 border-muted hover:border-primary/20">
                  <CardHeader>
                    <div className="mb-2 p-2 w-fit rounded-lg bg-primary/10">
                      <MessageSquareIcon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                      Reach out to us through any of these channels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <a
                      href="mailto:info@baysidebuilderswa.com.au"
                      className="flex items-center gap-3 text-sm hover:text-primary transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                        <MailIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <span>info@baysidebuilderswa.com.au</span>
                    </a>
                    <a
                      href="tel:+61890001234"
                      className="flex items-center gap-3 text-sm hover:text-primary transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                        <PhoneIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <span>(08) 9000 1234</span>
                    </a>
                    <div className="flex items-center gap-3 text-sm group">
                      <div className="p-2 rounded-lg bg-muted">
                        <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span>Dunsborough, WA 6281</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-muted hover:border-primary/20">
                  <CardHeader>
                    <div className="mb-2 p-2 w-fit rounded-lg bg-primary/10">
                      <ClockIcon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Business Hours</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                    <div className="pt-3 mt-3 border-t">
                      <p className="text-xs text-muted-foreground">
                        Emergency repairs available 24/7 for existing clients
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-muted hover:border-primary/20">
                  <CardHeader>
                    <div className="mb-2 p-2 w-fit rounded-lg bg-primary/10">
                      <GlobeIcon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>Connect With Us</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <a
                        href="https://facebook.com"
                        className="p-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors group"
                        aria-label="Facebook"
                      >
                        <FacebookIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                      </a>
                      <a
                        href="https://instagram.com"
                        className="p-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors group"
                        aria-label="Instagram"
                      >
                        <InstagramIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                      </a>
                      <a
                        href="https://linkedin.com"
                        className="p-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors group"
                        aria-label="LinkedIn"
                      >
                        <LinkedinIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <Card id="contact-form" className="lg:col-span-2 hover:shadow-xl transition-all duration-300 border-muted hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                      <CardDescription className="mt-2">
                        Tell us about your project and we&apos;ll get back to you with a free quote within 24 hours
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="hidden sm:inline-flex">
                      <ClockIcon className="mr-1 h-3 w-3" />
                      Free Quote
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                FAQ
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Quick answers to common questions about our services
              </p>
            </div>
            <div className="space-y-4">
              {[
                {
                  q: "How long does a typical construction project take?",
                  a: "Project timelines vary depending on scope and size. Home renovations typically take 2-6 weeks, while new construction can take 3-6 months."
                },
                {
                  q: "Do you provide free quotes?",
                  a: "Yes, we provide free, no-obligation quotes for all projects. We'll assess your needs and provide a detailed estimate within 48 hours."
                },
                {
                  q: "Are you licensed and insured?",
                  a: "Absolutely! We are fully licensed builders with comprehensive insurance coverage for all our projects and workers."
                },
                {
                  q: "Do you handle permits and approvals?",
                  a: "Yes, we can assist with all necessary permits and council approvals to ensure your project meets all regulatory requirements."
                }
              ].map((faq, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
