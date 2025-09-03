import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DesignTokensPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Design Tokens</h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive design system tokens for consistent styling across the application.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Colors Section */}
        <Card>
          <CardHeader>
            <CardTitle>Colors</CardTitle>
            <CardDescription>Brand colors with semantic naming based on Tweaken reference</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Primary</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary rounded-md border"></div>
                  <div>
                    <p className="font-mono text-sm">bg-primary</p>
                    <p className="text-xs text-muted-foreground">Navy Blue (#1e40af)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-hover rounded-md border"></div>
                  <div>
                    <p className="font-mono text-sm">bg-primary-hover</p>
                    <p className="text-xs text-muted-foreground">Hover state</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Secondary</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-secondary rounded-md border"></div>
                  <div>
                    <p className="font-mono text-sm">bg-secondary</p>
                    <p className="text-xs text-muted-foreground">Gold (#f59e0b)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-secondary-hover rounded-md border"></div>
                  <div>
                    <p className="font-mono text-sm">bg-secondary-hover</p>
                    <p className="text-xs text-muted-foreground">Hover state</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Neutral</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-muted rounded-md border"></div>
                  <div>
                    <p className="font-mono text-sm">bg-muted</p>
                    <p className="text-xs text-muted-foreground">Subtle backgrounds</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent rounded-md border"></div>
                  <div>
                    <p className="font-mono text-sm">bg-accent</p>
                    <p className="text-xs text-muted-foreground">Accent elements</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spacing Section */}
        <Card>
          <CardHeader>
            <CardTitle>Spacing</CardTitle>
            <CardDescription>4px base spacing system for consistent layouts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'xs', value: '0.25rem', px: '4px' },
                { name: 'sm', value: '0.5rem', px: '8px' },
                { name: 'md', value: '1rem', px: '16px' },
                { name: 'lg', value: '1.5rem', px: '24px' },
                { name: 'xl', value: '2rem', px: '32px' }
              ].map((space) => (
                <div key={space.name} className="flex items-center space-x-4">
                  <div className={`bg-primary h-4`} style={{ width: space.value }}></div>
                  <div>
                    <p className="font-mono text-sm">spacing-{space.name}</p>
                    <p className="text-xs text-muted-foreground">{space.value} ({space.px})</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Border Radius Section */}
        <Card>
          <CardHeader>
            <CardTitle>Border Radius</CardTitle>
            <CardDescription>Consistent corner rounding for UI elements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'sm', value: '0.25rem' },
                { name: 'md', value: '0.5rem' },
                { name: 'lg', value: '0.75rem' },
                { name: 'full', value: '9999px' }
              ].map((radius) => (
                <div key={radius.name} className="text-center space-y-2">
                  <div 
                    className="w-16 h-16 bg-primary mx-auto"
                    style={{ borderRadius: radius.value }}
                  ></div>
                  <div>
                    <p className="font-mono text-sm">rounded-{radius.name}</p>
                    <p className="text-xs text-muted-foreground">{radius.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Typography Section */}
        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>Font families and sizes with Inter as primary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Font Families</h4>
                <div className="space-y-2">
                  <p className="font-sans">Sans-serif: Inter (Headings & Body)</p>
                  <p className="font-serif">Serif: Source Serif 4 (Decorative)</p>
                  <p className="font-mono">Monospace: JetBrains Mono (Code)</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Text Sizes</h4>
                <div className="space-y-2">
                  <p className="text-xs">Extra Small (12px) - text-xs</p>
                  <p className="text-sm">Small (14px) - text-sm</p>
                  <p className="text-base">Base (16px) - text-base</p>
                  <p className="text-lg">Large (18px) - text-lg</p>
                  <p className="text-xl">Extra Large (20px) - text-xl</p>
                  <p className="text-2xl">2XL (24px) - text-2xl</p>
                  <p className="text-3xl">3XL (30px) - text-3xl</p>
                  <p className="text-4xl">4XL (36px) - text-4xl</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shadows Section */}
        <Card>
          <CardHeader>
            <CardTitle>Shadows</CardTitle>
            <CardDescription>Three levels of depth for layered interfaces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'sm', class: 'shadow-sm', desc: 'Subtle elevation' },
                { name: 'md', class: 'shadow-md', desc: 'Medium elevation' },
                { name: 'lg', class: 'shadow-lg', desc: 'High elevation' }
              ].map((shadow) => (
                <div key={shadow.name} className="text-center space-y-3">
                  <div className={`w-20 h-20 bg-card ${shadow.class} mx-auto rounded-md`}></div>
                  <div>
                    <p className="font-mono text-sm">{shadow.class}</p>
                    <p className="text-xs text-muted-foreground">{shadow.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Motion Section */}
        <Card>
          <CardHeader>
            <CardTitle>Motion</CardTitle>
            <CardDescription>Transition durations and easing functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Durations</h4>
                <ul className="space-y-1 text-sm">
                  <li><code className="bg-muted px-1 rounded">duration-fast</code> - 150ms (quick interactions)</li>
                  <li><code className="bg-muted px-1 rounded">duration-normal</code> - 300ms (complex transitions)</li>
                  <li><code className="bg-muted px-1 rounded">duration-slow</code> - 500ms (dramatic effects)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Easing Functions</h4>
                <ul className="space-y-1 text-sm">
                  <li><code className="bg-muted px-1 rounded">ease-out-cubic</code> - Natural deceleration</li>
                  <li><code className="bg-muted px-1 rounded">ease-in-cubic</code> - Natural acceleration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
            <CardDescription>Guidelines for using design tokens effectively</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">✅ Do</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Use semantic color names (primary, secondary) over specific colors</li>
                  <li>• Apply consistent spacing using the defined scale</li>
                  <li>• Use hover states for interactive elements</li>
                  <li>• Maintain WCAG AA contrast ratios in dark mode</li>
                  <li>• Use appropriate typography hierarchy</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">❌ Don&apos;t</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Hard-code colors or spacing values</li>
                  <li>• Skip hover states on clickable elements</li>
                  <li>• Use too many font weights or sizes</li>
                  <li>• Apply shadows inconsistently</li>
                  <li>• Mix different transition durations without purpose</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}