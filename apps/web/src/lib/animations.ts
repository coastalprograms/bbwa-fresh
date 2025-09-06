import type { Variants } from "framer-motion"

// Material Stack Effect - Cards stack up like building materials from foundation
export const materialStackVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 80,
    scale: 0.92,
    rotateX: 20,
    transformPerspective: 1000,
    filter: "blur(8px)"
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      delay: index * 0.2, // More pronounced staggering
      ease: [0.19, 1, 0.22, 1], // Construction-inspired easing
      type: "spring",
      stiffness: 60,
      damping: 25
    }
  })
}

// Hero Section - Slide up from foundation
export const heroVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.23, 1, 0.32, 1],
      staggerChildren: 0.2
    }
  }
}

// Tool Assembly Effect - Icons assemble like tools being organized
export const toolAssemblyVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
    rotate: -180,
    filter: "blur(4px)"
  },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      delay: index * 0.15, // Slower stagger for better impact
      ease: "backOut",
      type: "spring",
      stiffness: 120,
      damping: 18
    }
  })
}

// Text Reveal - Like blueprints being unveiled
export const textRevealVariants: Variants = {
  hidden: {
    opacity: 1,  // Changed from 0 to 1 to ensure text is visible by default
    x: -30,      // Reduced from -50 for subtler effect
    y: 0
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1]
    }
  }
}

// Image Reveal - Construction site reveal
export const imageRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.1,
    filter: "blur(10px)"
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: [0.23, 1, 0.32, 1]
    }
  }
}

// Staggered Children - For sections with multiple elements
export const staggeredChildrenVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

// Card Hover Variants - Enhanced hover effects
export const cardHoverVariants: Variants = {
  idle: {
    scale: 1,
    rotateY: 0,
    z: 0
  },
  hover: {
    scale: 1.02,
    rotateY: 5,
    z: 50,
    transition: {
      duration: 0.3,
      ease: "backOut"
    }
  }
}

// Section Fade In - General section entrance
export const sectionFadeInVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1],
      staggerChildren: 0.1
    }
  }
}

// Testimonial Rise - Like a satisfied client stepping forward
export const testimonialRiseVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    filter: "blur(6px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.19, 1, 0.22, 1], // Construction-inspired easing
      type: "spring",
      stiffness: 80,
      damping: 25
    }
  }
}

// Bidirectional variants for elements that animate in both directions
export const bidirectionalFadeVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1]
    }
  }
}

// Blueprint Text Reveal - Words appear like architectural drawings being unveiled
export const blueprintTextVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    rotateX: 90,
    transformPerspective: 1000,
    filter: "blur(8px)"
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      delay: index * 0.15, // Staggered word reveals
      ease: [0.19, 1, 0.22, 1],
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  })
}

// Construction Build Text - Text assembles from bottom to top like building blocks
export const constructionBuildVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 80,
    x: -20,
    scale: 0.8,
    rotate: -5,
    filter: "blur(6px)"
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    rotate: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      delay: index * 0.12, // Slightly faster stagger for building effect
      ease: [0.23, 1, 0.32, 1],
      type: "spring",
      stiffness: 80,
      damping: 25
    }
  })
}

// Foundation Rise Text - Lines appear like foundation being laid
export const foundationRiseVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
    scaleY: 0,
    transformOrigin: "bottom",
    filter: "blur(10px)"
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scaleY: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.0,
      delay: index * 0.3, // Slower stagger for line-by-line reveal
      ease: [0.19, 1, 0.22, 1],
      type: "spring",
      stiffness: 70,
      damping: 30
    }
  })
}

// Hero Text Container - Orchestrates the overall hero text animation
export const heroTextContainerVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

// Directional Slide Animations - For variety across pages

// Slide in from left side
export const slideLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.23, 1, 0.32, 1]
    }
  }
}

// Slide in from right side
export const slideRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.23, 1, 0.32, 1]
    }
  }
}

// Slide up from bottom (enhanced version of existing)
export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.23, 1, 0.32, 1]
    }
  }
}

// Simple fade for headers and titles
export const simpleFadeVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1]
    }
  }
}