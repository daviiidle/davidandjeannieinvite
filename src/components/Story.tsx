import { useState, useRef, useCallback } from 'react';
import { theme } from '../theme';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLanguage } from '../context/LanguageContext';
import { Section } from './Section';

interface StoryImage {
  src: string;
  alt: string;
}

interface StoryProps {
  images?: StoryImage[];
}

export function Story({
  images = [
    {
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop",
      alt: "Couple together"
    },
    {
      src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=800&fit=crop",
      alt: "Wedding moment"
    },
    {
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=800&fit=crop",
      alt: "Romantic scene"
    },
    {
      src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=800&fit=crop",
      alt: "Special moment"
    },
    {
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=800&fit=crop",
      alt: "Together"
    },
    {
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=800&fit=crop",
      alt: "Love"
    }
  ]
}: StoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const activateTitleAnimation = useCallback(() => {
    headingRef.current?.classList.add('page-title-handwriting--active');
  }, []);
  useScrollReveal(sectionRef, { duration: 0.9, onEnter: activateTitleAnimation });
  const { strings } = useLanguage();

  const [selectedImage, setSelectedImage] = useState<StoryImage | null>(null);

  const openImage = (image: StoryImage) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  return (
    <Section
      id="story"
      ref={sectionRef}
      aria-labelledby="story-heading"
      style={{
        backgroundColor: theme.colors.background.white,
      }}
      maxWidth={theme.layout.maxWidth}
    >
        {/* Section Heading */}
        <h2
          id="story-heading"
          ref={headingRef}
          className="font-serif text-center mb-12 page-title-handwriting"
          style={{
            fontFamily: '"Mea Culpa", "Playfair Display", serif',
            fontSize: theme.typography.heading.h2,
            fontWeight: 400,
            color: theme.colors.primary.dustyBlue,
            letterSpacing: '0.05em',
            marginBottom: theme.spacing.md,
          }}
        >
          <span className="hero-handwriting">
            <span className="hero-handwriting__text">{strings.story.heading}</span>
          </span>
        </h2>

        {/* Photo Gallery Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: theme.spacing.lg,
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => openImage(image)}
              className="photo-card"
              style={{
                position: 'relative',
                aspectRatio: '3/4',
                borderRadius: theme.borderRadius.lg,
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: theme.shadows.md,
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {/* Hover Overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(139, 157, 195, 0.12)',
                  transition: theme.transitions.base,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: theme.typography.fontSize.sm,
                  fontFamily: theme.typography.fontFamily.sans,
                  fontWeight: theme.typography.fontWeight.medium,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(139, 157, 195, 0.24)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(139, 157, 195, 0.12)';
                }}
              >
                {strings.story.viewPrompt}
              </div>
            </div>
          ))}
        </div>

      {/* Image Modal/Lightbox */}
      {selectedImage && (
        <div
          onClick={closeImage}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: theme.spacing.lg,
            cursor: 'pointer',
          }}
        >
          {/* Close Button */}
          <button
            onClick={closeImage}
            style={{
              position: 'absolute',
              top: theme.spacing.xl,
              right: theme.spacing.xl,
              backgroundColor: 'transparent',
              border: 'none',
              color: theme.colors.text.inverse,
              fontSize: theme.typography.fontSize['3xl'],
              cursor: 'pointer',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: theme.borderRadius.full,
              transition: theme.transitions.base,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label={strings.story.closeLabel}
          >
            ×
          </button>

          {/* Large Image */}
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              borderRadius: theme.borderRadius.lg,
              boxShadow: theme.shadows['2xl'],
            }}
          />
        </div>
      )}
    </Section>
  );
}
