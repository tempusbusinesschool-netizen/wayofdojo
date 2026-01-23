# 🎨 Animations WayofDojo - Documentation Technique

## Dépendances requises

```bash
yarn add framer-motion canvas-confetti
```

```typescript
// Types
import type { Variants, Transition } from 'framer-motion';
```

---

## 1. StepTransition - Animation de transition entre étapes

### Configuration générale

```typescript
interface StepTransitionProps {
  isVisible: boolean;
  stepNumber?: number;
  stepTitle: string;
  stepEmoji: string;
  userName?: string;
  actionType?: 'step_complete' | 'profile_created' | 'technique_learned' | 
               'game_won' | 'challenge_done' | 'badge_earned' | 'dojo_entered';
  customMessage?: string | null;
  xpEarned?: number;
  onComplete?: () => void;
}

// Timing des stages
const STAGE_TIMINGS = {
  stage0_to_stage1: 400,   // ms
  stage1_to_stage2: 1200,  // ms
  stage2_to_close: 2500,   // ms
};
```

### Confettis configuration

```typescript
import confetti from 'canvas-confetti';

// Explosion principale
confetti({
  particleCount: 150,
  spread: 70,
  origin: { y: 0.4 },
  colors: ['#10B981', '#14B8A6', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4']
});
```

### Animations Framer Motion détaillées

```typescript
// === FOND OVERLAY ===
const overlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const overlayTransition: Transition = {
  duration: 0.3
};

// === CERCLES DE BACKGROUND (3 cercles) ===
// Chaque cercle avec un délai différent
const circleVariants = (index: number): Variants => ({
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 4 - index,        // scale: [4, 3, 2]
    opacity: 0.1 + index * 0.05  // opacity: [0.1, 0.15, 0.2]
  }
});

const circleTransition = (index: number): Transition => ({
  duration: 2 - index * 0.5,  // [2, 1.5, 1]
  ease: "easeOut",
  delay: index * 0.2          // [0, 0.2, 0.4]
});

// === SPHÈRE PRINCIPALE (Spring animation) ===
const sphereVariants: Variants = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 }
};

const sphereTransition: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 15
};

// === GLOW PULSANT ===
const glowAnimation = {
  boxShadow: [
    "0 0 20px rgba(16, 185, 129, 0.5)",
    "0 0 40px rgba(16, 185, 129, 0.8)",
    "0 0 20px rgba(16, 185, 129, 0.5)"
  ]
};

const glowTransition: Transition = {
  duration: 1.5,
  repeat: Infinity
};

// === BORDURE ROTATIVE ===
const borderRotateAnimation = {
  rotate: 360
};

const borderRotateTransition: Transition = {
  duration: 8,
  repeat: Infinity,
  ease: "linear"
};

// === SPARKLES (6 particules en cercle) ===
const sparkleAnimation = (index: number) => ({
  opacity: [0, 1, 0],
  scale: [0, 1, 0],
  x: Math.cos(index * 60 * Math.PI / 180) * 80,
  y: Math.sin(index * 60 * Math.PI / 180) * 80,
});

const sparkleTransition = (index: number): Transition => ({
  duration: 1.5,
  repeat: Infinity,
  delay: index * 0.2,
  repeatDelay: 0.5
});

// === TEXTE APPARITION ===
const textVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// === POINTS DE PROGRESSION ===
const dotTransition = (index: number): Transition => ({
  delay: 0.6 + index * 0.1
});

const dotVariants: Variants = {
  initial: { scale: 0 },
  animate: { scale: 1 }
};
```

### CSS Classes (TailwindCSS)

```css
/* Fond principal */
.step-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center;
  background: linear-gradient(135deg, rgba(0,0,0,0.95), rgba(30,41,59,0.98));
}

/* Sphère centrale */
.step-sphere {
  @apply w-32 h-32 rounded-full flex items-center justify-center;
  background: radial-gradient(circle at 30% 30%, #10B981, #059669);
}

/* Bordure gradient */
.rotating-border {
  background: conic-gradient(from 0deg, #10B981, #14B8A6, #F59E0B, #EC4899, #8B5CF6, #10B981);
}
```

---

## 2. TechniqueCelebration - Célébration maîtrise technique

### Confettis (3 vagues)

```typescript
// Vague 1: Explosion centrale (immédiat)
confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
  colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
});

// Vague 2: Côtés (200ms après)
setTimeout(() => {
  // Gauche
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.6 },
    colors: ['#FFD700', '#FF6B6B', '#4ECDC4']
  });
  // Droite
  confetti({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.6 },
    colors: ['#45B7D1', '#96CEB4', '#FFEAA7']
  });
}, 200);

// Vague 3: Pluie d'étoiles (400ms après)
setTimeout(() => {
  confetti({
    particleCount: 30,
    spread: 100,
    origin: { y: 0 },
    gravity: 0.5,
    shapes: ['star'],
    colors: ['#FFD700', '#FFA500']
  });
}, 400);
```

### Son de victoire (Web Audio API)

```typescript
const playVictorySound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const notes = [523.25, 659.25, 783.99, 1046.50]; // Do, Mi, Sol, Do aigu
  
  notes.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = freq;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + index * 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + 0.3);
    
    oscillator.start(audioContext.currentTime + index * 0.15);
    oscillator.stop(audioContext.currentTime + index * 0.15 + 0.3);
  });
};
```

### Animations principales

```typescript
// Trophée flottant
const trophyAnimation = {
  y: [0, -10, 0],
  rotate: [0, -5, 5, 0]
};

const trophyTransition: Transition = {
  duration: 1.5,
  repeat: Infinity,
  ease: "easeInOut"
};

// Carte popup (spring)
const cardVariants: Variants = {
  initial: { scale: 0, rotate: -10 },
  animate: { scale: 1, rotate: 0 },
  exit: { scale: 0, opacity: 0 }
};

const cardTransition: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 15
};

// Étoiles en cascade
const starVariants = (index: number): Variants => ({
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 }
});

const starTransition = (index: number): Transition => ({
  delay: 1 + index * 0.1,
  type: "spring"
});
```

---

## 3. TanakaAdult - Message mentor avec typewriter

### Effet typewriter

```typescript
const [displayedText, setDisplayedText] = useState('');
const [isTyping, setIsTyping] = useState(false);

useEffect(() => {
  if (!isVisible || !message) return;
  
  setDisplayedText('');
  setIsTyping(true);
  
  const chars = message.split('');
  let currentIndex = 0;
  
  const timer = setInterval(() => {
    if (currentIndex < chars.length) {
      const charToAdd = chars[currentIndex];
      setDisplayedText(prev => prev + charToAdd);
      currentIndex++;
    } else {
      setIsTyping(false);
      clearInterval(timer);
    }
  }, 30); // 30ms par caractère

  return () => clearInterval(timer);
}, [message, isVisible]);
```

### Curseur clignotant

```typescript
<motion.span
  animate={{ opacity: [1, 0] }}
  transition={{ duration: 0.5, repeat: Infinity }}
  className="inline-block w-2 h-4 bg-amber-400 ml-1"
/>
```

---

## 4. ReflectiveJournal - Animation XP

### Animation +5 XP

```typescript
const xpAnimation: Variants = {
  initial: { opacity: 0, y: 0, scale: 0.5 },
  animate: { opacity: 1, y: -30, scale: 1 },
  exit: { opacity: 0, y: -60 }
};

// Trigger l'animation
setShowXpAnimation(true);
setTimeout(() => setShowXpAnimation(false), 2000);
```

---

## 5. Couleurs et Gradients

```typescript
// Palette principale
const COLORS = {
  success: '#10B981',  // Emerald
  warning: '#F59E0B',  // Amber
  error: '#EF4444',    // Red
  info: '#06B6D4',     // Cyan
  purple: '#8B5CF6',   // Violet
  pink: '#EC4899',     // Pink
};

// Confetti colors
const CONFETTI_COLORS = [
  '#10B981', '#14B8A6', '#F59E0B', 
  '#EC4899', '#8B5CF6', '#06B6D4'
];

// Celebration colors  
const CELEBRATION_COLORS = [
  '#FFD700', '#FF6B6B', '#4ECDC4',
  '#45B7D1', '#96CEB4', '#FFEAA7'
];
```

---

## Usage Exemple

```tsx
import StepTransition from '@/components/animations/StepTransition';
import TechniqueCelebration from '@/components/animations/TechniqueCelebration';

function MyComponent() {
  const [showTransition, setShowTransition] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  return (
    <>
      <StepTransition
        isVisible={showTransition}
        stepTitle="Mission accomplie"
        stepEmoji="⚔️"
        actionType="challenge_done"
        xpEarned={30}
        onComplete={() => setShowTransition(false)}
      />
      
      <TechniqueCelebration
        isVisible={showCelebration}
        technique={{ name: 'Ikkyo', level: 'maîtrisé' }}
        onClose={() => setShowCelebration(false)}
      />
    </>
  );
}
```
