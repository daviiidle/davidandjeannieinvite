import { theme } from '../theme';
import { useLanguage } from '../context/LanguageContext';
import { Countdown } from './Countdown';

interface HeroProps {
  groomName?: string;
  brideName?: string;
  weddingDate?: string;
}

export function Hero({
  groomName,
  brideName,
  weddingDate,
}: HeroProps) {
  const { strings } = useLanguage();
  const resolvedGroom = (groomName ?? strings.hero.groomName).trim();
  const resolvedBride = (brideName ?? strings.hero.brideName).trim();
  const resolvedDate = weddingDate ?? strings.hero.date;
  const namesText = `${resolvedGroom} &\n${resolvedBride}`;
  const backgroundImageUrl =
    'https://images.unsplash.com/photo-1520854223477-08661d33a360?w=1600&auto=format&fit=crop&q=80';

  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden hero-opener-root"
      style={{
        backgroundColor: theme.colors.background.white,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.9)), url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <div
        className="hero-opener__background"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(255,255,255,0.3)',
        }}
      />

      <div className="w-full max-w-4xl text-center relative z-10 space-y-6">
        <p
          className="hero-opener__names font-serif"
          style={{
            fontFamily: theme.typography.fontFamily.serif,
            fontSize: 'clamp(2rem, 7vw, 5rem)',
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary.dustyBlue,
            letterSpacing: '0.02em',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.05,
            textAlign: 'center',
          }}
        >
          {namesText}
        </p>

        <span
          className="hero-opener__divider"
          aria-hidden="true"
          style={{
            width: '80px',
            height: '2px',
            backgroundColor: theme.colors.primary.dustyBlue,
            display: 'inline-block',
          }}
        />

        <div className="space-y-6">
          <p
            className="hero-opener__date font-sans tracking-[0.3em]"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.secondary.slate,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}
          >
            {resolvedDate}
          </p>

          <Countdown />
        </div>
      </div>
    </section>
  );
}
