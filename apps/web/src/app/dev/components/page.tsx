"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useState } from "react"

export default function ComponentsPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadingDemo = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="container mx-auto py-10 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">shadcn/ui Component Library</h1>
        <p className="text-muted-foreground text-lg">
          A showcase of all installed components with their variants and usage examples
        </p>
      </div>

      <Tabs defaultValue="buttons" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="overlays">Overlays</TabsTrigger>
          <TabsTrigger value="carousel">Carousel</TabsTrigger>
        </TabsList>

        {/* Buttons Tab */}
        <TabsContent value="buttons" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>All button variants with loading states and animations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              
              <Separator />
              
              <div className="flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">🚀</Button>
              </div>

              <Separator />

              <div className="flex flex-wrap gap-4">
                <Button disabled>Disabled</Button>
                <Button 
                  onClick={handleLoadingDemo}
                  disabled={isLoading}
                  className={isLoading ? "animate-button-loading" : ""}
                >
                  {isLoading ? "Loading..." : "Click for Loading Demo"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Code Example</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>{`import { Button } from "@/components/ui/button"

<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cards Tab */}
        <TabsContent value="cards" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Card Examples</CardTitle>
              <CardDescription>Cards with hover animations and different layouts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="animate-card-hover cursor-pointer">
                  <CardHeader>
                    <CardTitle>Basic Card</CardTitle>
                    <CardDescription>A simple card with hover animation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This card demonstrates the custom hover animation with elevation.</p>
                  </CardContent>
                </Card>

                <Card className="animate-card-hover cursor-pointer">
                  <CardHeader>
                    <CardTitle>Service Card</CardTitle>
                    <CardDescription>Perfect for showcasing services</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Badge variant="secondary">Featured</Badge>
                    <p>Service cards can include badges and multiple content sections.</p>
                  </CardContent>
                </Card>

                <Card className="animate-card-hover cursor-pointer">
                  <CardHeader>
                    <CardTitle>Project Card</CardTitle>
                    <CardDescription>Ideal for project galleries</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex gap-2">
                      <Badge>React</Badge>
                      <Badge variant="outline">TypeScript</Badge>
                    </div>
                    <p>Project cards can showcase technologies and details.</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Code Example</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>{`import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

<Card className="animate-card-hover cursor-pointer">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
</Card>`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigation Tab */}
        <TabsContent value="navigation" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Navigation & Tabs</CardTitle>
              <CardDescription>Navigation menus and tabbed interfaces</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Tabs Component</h4>
                <Tabs defaultValue="tab1" className="w-full max-w-md">
                  <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tab1">Content for Tab 1</TabsContent>
                  <TabsContent value="tab2">Content for Tab 2</TabsContent>
                  <TabsContent value="tab3">Content for Tab 3</TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Badges & Feedback</CardTitle>
              <CardDescription>Status indicators and user feedback components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Badge Variants</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Layout Components</CardTitle>
              <CardDescription>Separators and structural elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Separator</h4>
                <p>Content above separator</p>
                <Separator className="my-4" />
                <p>Content below separator</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Accordion</h4>
                <Accordion type="single" collapsible className="animate-accordion-slide">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is shadcn/ui?</AccordionTrigger>
                    <AccordionContent>
                      shadcn/ui is a collection of reusable components built using Radix UI and Tailwind CSS.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I customize components?</AccordionTrigger>
                    <AccordionContent>
                      You can customize components by modifying the CSS variables in your globals.css file or by passing custom className props.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forms Tab */}
        <TabsContent value="forms" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Form Components</CardTitle>
              <CardDescription>Input fields and form controls</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Form components like Input, Label, and Select are available but not showcased in this demo.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overlays Tab */}
        <TabsContent value="overlays" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Overlays & Modals</CardTitle>
              <CardDescription>Sheets, dialogs, and overlay components</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <h4 className="text-sm font-medium mb-2">Sheet (Side Panel)</h4>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Open Sheet</Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Sheet Title</SheetTitle>
                      <SheetDescription>
                        This is a sheet component that slides in from the side.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                      <p>Sheet content goes here. Perfect for mobile navigation or side panels.</p>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Carousel Tab */}
        <TabsContent value="carousel" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Carousel Component</CardTitle>
              <CardDescription>Image galleries and content carousels</CardDescription>
            </CardHeader>
            <CardContent>
              <Carousel className="w-full max-w-xs mx-auto">
                <CarouselContent>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                            <span className="text-4xl font-semibold">{index + 1}</span>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Code Example</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>{`import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

<Carousel className="w-full max-w-xs">
  <CarouselContent>
    {Array.from({ length: 5 }).map((_, index) => (
      <CarouselItem key={index}>
        <Card>
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <span className="text-4xl font-semibold">{index + 1}</span>
          </CardContent>
        </Card>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}