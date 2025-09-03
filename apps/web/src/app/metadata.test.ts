import { describe, it, expect } from '@jest/globals'
import { metadata as rootMetadata } from './layout'
import { metadata as marketingMetadata } from './(marketing)/layout'

describe('Metadata Configuration', () => {
  describe('Root Layout Metadata', () => {
    it('should have required metadata fields', () => {
      expect(rootMetadata).toBeDefined()
      expect(rootMetadata.title).toBeDefined()
      expect(rootMetadata.description).toBeDefined()
      expect(rootMetadata.metadataBase).toBeDefined()
    })

    it('should have correct metadataBase URL', () => {
      expect(rootMetadata.metadataBase).toEqual(new URL('https://baysidebuilderswa.com.au'))
    })

    it('should have title template configured', () => {
      expect(rootMetadata.title).toHaveProperty('template')
      expect(rootMetadata.title).toHaveProperty('default')
      expect((rootMetadata.title as any).template).toBe('%s | Bayside Builders WA')
    })

    it('should have OpenGraph configuration', () => {
      expect(rootMetadata.openGraph).toBeDefined()
      expect(rootMetadata.openGraph).toHaveProperty('type', 'website')
      expect(rootMetadata.openGraph).toHaveProperty('locale', 'en_AU')
      expect(rootMetadata.openGraph).toHaveProperty('siteName', 'Bayside Builders WA')
      expect(rootMetadata.openGraph).toHaveProperty('images')
    })

    it('should have Twitter card configuration', () => {
      expect(rootMetadata.twitter).toBeDefined()
      expect(rootMetadata.twitter).toHaveProperty('card', 'summary_large_image')
      expect(rootMetadata.twitter).toHaveProperty('images')
    })

    it('should have robots configuration', () => {
      expect(rootMetadata.robots).toBeDefined()
      expect(rootMetadata.robots).toHaveProperty('index', true)
      expect(rootMetadata.robots).toHaveProperty('follow', true)
    })

    it('should have relevant keywords', () => {
      expect(rootMetadata.keywords).toBeDefined()
      expect(Array.isArray(rootMetadata.keywords)).toBe(true)
      const keywords = rootMetadata.keywords as string[]
      expect(keywords).toContain('construction Perth')
      expect(keywords).toContain('builders Perth WA')
    })

    it('should have canonical URL', () => {
      expect(rootMetadata.alternates).toBeDefined()
      expect(rootMetadata.alternates).toHaveProperty('canonical', 'https://baysidebuilderswa.com.au')
    })
  })

  describe('Marketing Layout Metadata', () => {
    it('should have marketing-specific metadata', () => {
      expect(marketingMetadata).toBeDefined()
      expect(marketingMetadata.title).toBeDefined()
      expect(marketingMetadata.description).toBeDefined()
    })

    it('should have relevant marketing keywords', () => {
      expect(marketingMetadata.keywords).toBeDefined()
      expect(Array.isArray(marketingMetadata.keywords)).toBe(true)
      const keywords = marketingMetadata.keywords as string[]
      expect(keywords.length).toBeGreaterThan(0)
    })

    it('should have OpenGraph images with correct dimensions', () => {
      expect(marketingMetadata.openGraph?.images).toBeDefined()
      const images = marketingMetadata.openGraph?.images as any[]
      if (images && images.length > 0) {
        expect(images[0]).toHaveProperty('width', 1200)
        expect(images[0]).toHaveProperty('height', 630)
        expect(images[0]).toHaveProperty('alt')
      }
    })
  })

  describe('SEO Best Practices', () => {
    it('should have description within optimal length', () => {
      const description = rootMetadata.description as string
      expect(description.length).toBeGreaterThan(120)
      expect(description.length).toBeLessThan(160)
    })

    it('should have title within optimal length', () => {
      const defaultTitle = (rootMetadata.title as any).default
      expect(defaultTitle.length).toBeLessThan(60)
    })

    it('should include location-specific keywords', () => {
      const keywords = rootMetadata.keywords as string[]
      const description = rootMetadata.description as string
      
      // Should mention Perth/WA
      const hasLocationKeywords = keywords.some(keyword => 
        keyword.toLowerCase().includes('perth') || 
        keyword.toLowerCase().includes('wa') ||
        keyword.toLowerCase().includes('western australia')
      )
      const hasLocationInDescription = 
        description.toLowerCase().includes('perth') ||
        description.toLowerCase().includes('wa') ||
        description.toLowerCase().includes('western australia')
      
      expect(hasLocationKeywords || hasLocationInDescription).toBe(true)
    })

    it('should include business-relevant keywords', () => {
      const keywords = rootMetadata.keywords as string[]
      const businessKeywords = ['construction', 'builders', 'renovation', 'extension']
      
      const hasBusinessKeywords = businessKeywords.some(businessKeyword =>
        keywords.some(keyword => keyword.toLowerCase().includes(businessKeyword))
      )
      
      expect(hasBusinessKeywords).toBe(true)
    })
  })
})