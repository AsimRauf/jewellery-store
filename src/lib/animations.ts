// Animation variants and configurations for Framer Motion
import { Variants } from 'framer-motion';

// Common transition configurations
export const transitions = {
  smooth: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.6
  },
  spring: {
    type: 'spring',
    damping: 25,
    stiffness: 120
  },
  fast: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.3
  }
} as const;

// Stagger configurations for sequential animations
export const staggerConfig = {
  staggerChildren: 0.1,
  delayChildren: 0.1
};

export const fastStaggerConfig = {
  staggerChildren: 0.05,
  delayChildren: 0.05
};

// Header animation variants
export const headerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
    transition: transitions.smooth
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...transitions.smooth,
      delay: 0.1
    }
  }
};

// Hero image animation variants
export const heroImageVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    transition: transitions.smooth
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      ...transitions.smooth,
      delay: 0.3
    }
  }
};

// Text section animation variants
export const textVariants = {
  left: {
    hidden: {
      opacity: 0,
      x: -50,
      transition: transitions.smooth
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        ...transitions.smooth,
        delay: 0.2
      }
    }
  },
  right: {
    hidden: {
      opacity: 0,
      x: 50,
      transition: transitions.smooth
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        ...transitions.smooth,
        delay: 0.2
      }
    }
  }
} as const;

// Button animation variants
export const buttonVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: transitions.smooth
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...transitions.smooth,
      delay: 0.4
    }
  }
};

// Container variants for staggered animations
export const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: transitions.smooth
  },
  visible: {
    opacity: 1,
    transition: {
      ...transitions.smooth,
      ...staggerConfig
    }
  }
};

// Item variants for staggered animations
export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: transitions.smooth
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth
  }
};

// Fade in animation variants
export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: transitions.smooth
  },
  visible: {
    opacity: 1,
    transition: {
      ...transitions.smooth,
      delay: 0.2
    }
  }
};

// Scale animation variants
export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    transition: transitions.smooth
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      ...transitions.smooth,
      delay: 0.3
    }
  }
};

// Slide up animation variants
export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    transition: transitions.smooth
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...transitions.smooth,
      delay: 0.25
    }
  }
};



// Export type for animation direction
export type AnimationDirection = 'left' | 'right';

// Helper function to get text variants based on direction
export const getTextVariants = (direction: AnimationDirection = 'left'): Variants => {
  return textVariants[direction];
};

// Helper function to create staggered container
export const createStaggerContainer = (customStagger?: typeof staggerConfig): Variants => ({
  hidden: {
    opacity: 0,
    transition: transitions.smooth
  },
  visible: {
    opacity: 1,
    transition: {
      ...transitions.smooth,
      ...(customStagger || staggerConfig)
    }
  }
});

// Helper function to create custom delay variants
export const createDelayedVariants = (baseVariants: Variants, delay: number): Variants => {
  const visibleVariant = baseVariants.visible;
  if (typeof visibleVariant === 'object' && visibleVariant !== null && 'transition' in visibleVariant) {
    return {
      ...baseVariants,
      visible: {
        ...visibleVariant,
        transition: {
          ...visibleVariant.transition,
          delay
        }
      }
    };
  }
  return baseVariants;
};
