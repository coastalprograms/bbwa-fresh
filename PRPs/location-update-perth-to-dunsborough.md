# PRP: Location Update - Perth to Dunsborough and Surrounding Areas

## Objective
Transform the entire Bayside Builders WA website from Perth-focused content to Dunsborough and surrounding South West WA areas. This includes updating all location references, service areas, regional context, and location-dependent functionality.

## Context & Research

### Current State Analysis
The codebase contains extensive Perth location references across multiple files:

**Core Marketing Pages:**
- `apps/web/src/app/(marketing)/page.tsx` - Homepage with multiple Perth references
- `apps/web/src/app/(marketing)/about/page.tsx` - About page
- `apps/web/src/app/(marketing)/contact/page.tsx` - Contact page
- All service pages under `apps/web/src/app/(marketing)/services/`

**Components:**
- `apps/web/src/components/whimsy/PerthWeatherWidget.tsx` - Location-specific functionality
- `apps/web/src/components/layout/Footer.tsx` - Footer with Perth context
- Various marketing components with Perth references

**Key Perth References Found:**
- "Perth's Trusted Construction Partners"
- "15+ years delivering quality construction projects across Perth"
- "Building Excellence Across Perth" 
- Perth suburbs: Cottesloe, Fremantle, Scarborough, Joondalup, Rockingham, Ellenbrook, Mandurah
- "Perth construction industry"
- "Perth Local Expertise"
- Perth-specific business context and positioning

### Target Location Research

**Dunsborough Geographic Context:**
- Located in South West WA, part of City of Busselton
- Coastal town known for premium lifestyle and tourism
- Different building requirements: coastal conditions, holiday homes, luxury residential

**Surrounding Service Areas to Replace Perth Suburbs:**
Primary Areas:
- Busselton (major town)
- Margaret River (premium wine region)
- Yallingup (coastal, surfing community)
- Eagle Bay (exclusive coastal)
- Quindalup (residential coastal)

Secondary Areas:
- Vasse (growing residential)
- Dunsborough (town center)
- Geographe (coastal residential)
- Broadwater (residential)
- Wonnerup (rural residential)

**Regional Business Context:**
- Focus shifts from urban construction to coastal/lifestyle building
- Higher emphasis on holiday homes, luxury residences
- Wine industry commercial building
- Tourism-related commercial construction
- Coastal building expertise (salt air, foundations, etc.)

**Climate Differences:**
- More temperate coastal climate
- Different seasonal patterns than Perth
- Ocean influence on weather

## Implementation Blueprint

### Phase 1: Content Updates (Priority 1)
**Files to Update:**
1. `apps/web/src/app/(marketing)/page.tsx` - Homepage hero and all sections
2. `apps/web/src/app/(marketing)/about/page.tsx` 
3. `apps/web/src/app/(marketing)/contact/page.tsx`
4. All service pages in `apps/web/src/app/(marketing)/services/`
5. `apps/web/src/app/layout.tsx` - Meta descriptions and titles
6. `apps/web/src/components/layout/Footer.tsx`

**Content Mapping Strategy:**
- "Perth's Trusted Construction Partners" → "Dunsborough's Premier Construction Partners"
- "Perth construction industry" → "South West construction industry"
- Perth suburbs list → Dunsborough surrounding areas list
- "Perth Local Expertise" → "South West Local Expertise"
- Urban construction focus → Coastal/lifestyle construction focus

### Phase 2: Component Refactoring (Priority 2)
**Component Updates:**
1. Rename `PerthWeatherWidget.tsx` to `DunsboroughWeatherWidget.tsx`
2. Update weather widget functionality for Dunsborough coordinates
3. Update any other location-specific component names
4. Verify component imports and references

### Phase 3: Functionality Updates (Priority 3)
**Technical Updates:**
1. Weather widget coordinates and API calls
2. Google Maps integration (if present)
3. Location-based SEO metadata
4. Contact information and addresses
5. Service area calculations

### Phase 4: Content Adaptation (Priority 4)
**Regional Context Updates:**
1. Adapt marketing copy to coastal/lifestyle focus
2. Update service descriptions for regional relevance
3. Adjust project examples and case studies
4. Update testimonials context if needed

## Detailed Implementation Tasks

### Task 1: Homepage Content Update
**File:** `apps/web/src/app/(marketing)/page.tsx`

**Specific Changes:**
```typescript
// Line 85: Update main hero title
- "Perth's Trusted Construction Partners"
+ "Dunsborough's Premier Construction Partners"

// Line 89: Update service area description
- "15+ years delivering quality construction projects across Perth"
+ "15+ years delivering quality construction projects across the South West"

// Line 136: Update services section title  
- "Building Excellence Across Perth"
+ "Building Excellence Across Dunsborough & South West"

// Line 139: Update service areas description
- "From Fremantle to Ellenbrook, Scarborough to Rockingham - we deliver quality construction services on time and within budget across all Perth suburbs."
+ "From Busselton to Margaret River, Yallingup to Eagle Bay - we deliver quality construction services on time and within budget across all South West communities."

// Line 150-151: Update suburbs array
- ['Cottesloe', 'Fremantle', 'Scarborough', 'Joondalup', 'Rockingham', 'Ellenbrook', 'Mandurah', '& More']
+ ['Busselton', 'Margaret River', 'Yallingup', 'Eagle Bay', 'Quindalup', 'Vasse', 'Geographe', '& More']

// Continue similar updates throughout the file
```

### Task 2: Weather Widget Refactoring
**Current File:** `apps/web/src/components/whimsy/PerthWeatherWidget.tsx`

**Actions:**
1. Rename file to `DunsboroughWeatherWidget.tsx`
2. Update component name and functionality
3. Update temperature ranges for coastal climate
4. Update weather messages for regional context
5. Find and update all imports of this component

### Task 3: Systematic Text Replacement
**Search and Replace Patterns:**
- "Perth" → "Dunsborough" (where geographically appropriate)
- "Perth's" → "Dunsborough's" 
- "across Perth" → "across the South West"
- "Perth construction industry" → "South West construction industry"
- "Perth Local" → "South West Local"
- "Perth residents" → "South West residents"

**Manual Review Required For:**
- Context-specific content that needs adaptation beyond simple replacement
- Technical terms or certifications that are Perth-specific
- Contact information and addresses

### Task 4: Service Area Updates
**Files Containing Service Areas:**
- Homepage service areas section
- Footer service areas
- About page regional information
- Contact page coverage areas

**New Service Area Structure:**
```typescript
const SERVICE_AREAS = [
  'Dunsborough', 'Busselton', 'Margaret River', 'Yallingup', 
  'Eagle Bay', 'Quindalup', 'Vasse', 'Geographe', 'Broadwater'
]
```

## Validation Gates

### 1. Search Verification
```bash
# Check for remaining Perth references
find apps -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" | xargs grep -l "Perth"

# Verify new Dunsborough references are in place
find apps -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" | xargs grep -l "Dunsborough"
```

### 2. Code Quality Checks
```bash
# Run linting
npm run lint

# Run type checking  
npm run typecheck

# Build verification
npm run build
```

### 3. Component Functionality Testing
```bash
# Start development server
npm run dev

# Manual testing checklist:
# - Homepage renders correctly
# - Weather widget displays and functions
# - All service pages load
# - Contact forms work
# - Mobile responsive design intact
# - No broken links or references
```

### 4. Content Verification
- [ ] All Perth references replaced or contextually updated
- [ ] Service areas geographically accurate for South West WA
- [ ] Component names and imports updated
- [ ] Marketing copy flows naturally with new location context
- [ ] Contact information reflects new service area
- [ ] SEO metadata updated for new location

## External Research Links
- **Dunsborough Tourism:** https://www.australia.com/en/places/wa/dunsborough.html
- **City of Busselton:** https://www.busselton.wa.gov.au/
- **South West WA Towns:** https://www.southwestwa.com.au/
- **Building Requirements WA:** https://www.commerce.wa.gov.au/building-and-energy

## Success Criteria
1. **Zero Perth references remain** in user-facing content (except historical/testimonials if appropriate)
2. **All location-specific functionality works** (weather widget, maps, etc.)
3. **Content flows naturally** with South West regional context
4. **All validation gates pass** without errors
5. **Mobile and desktop experiences** remain polished and professional

## Risk Mitigation
- **Backup critical files** before starting major changes
- **Test incrementally** after each major file update
- **Verify component imports** after any file renames
- **Double-check geographic accuracy** of new service areas

## Estimated Effort
- **Content Updates:** 2-3 hours
- **Component Refactoring:** 1-2 hours  
- **Testing & Validation:** 1-2 hours
- **Total:** 4-7 hours for comprehensive implementation

---

**PRP Confidence Score: 8/10**

*This PRP provides comprehensive context for one-pass implementation with clear patterns, specific file locations, systematic approach, and thorough validation gates. Success depends on careful attention to detail and systematic execution of the defined tasks.*