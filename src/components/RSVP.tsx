import { useRef, useState, type CSSProperties } from 'react';
import { theme } from '../theme';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLanguage } from '../context/LanguageContext';

interface RSVPProps {
  heading?: string;
  deadline?: string;
  emails?: string[];
}

interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
  plusOne: boolean;
  plusOneName: string;
  notes: string;
  groomSurname: string;
  brideSurname: string;
  honeypot: string;
}

const RSVP_ENDPOINT =
  import.meta.env.VITE_RSVP_ENDPOINT ??
  'https://script.google.com/macros/s/AKfycbwN6KaSDGUpwSwR8kHMoKcuG256iHX_g-7i8pRwiyqmuID89sKSir_-VsHYbXLtqck21g/exec';

export function RSVP({
  heading,
  deadline,
  emails = ['daviiidle@gmail.com', 'jheea05@gmail.com'],
}: RSVPProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, { duration: 0.7 });
  const { strings } = useLanguage();
  const headingText = heading ?? strings.rsvp.heading;
  const deadlineText = deadline ?? strings.rsvp.deadline;

  const [formState, setFormState] = useState<FormState>({
    firstName: '',
    lastName: '',
    phone: '',
    plusOne: false,
    plusOneName: '',
    notes: '',
    groomSurname: '',
    brideSurname: '',
    honeypot: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const canSubmit =
    formState.firstName.trim() &&
    formState.lastName.trim() &&
    formState.phone.trim() &&
    formState.groomSurname.trim() &&
    formState.brideSurname.trim();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || status === 'submitting') return;

    setStatus('submitting');
    setErrorMessage(null);

    try {
      const payload = {
        name: `${formState.firstName.trim()} ${formState.lastName.trim()}`.trim(),
        phone: formState.phone.trim(),
        plusOneName: formState.plusOne ? formState.plusOneName.trim() : '',
        notes: formState.notes.trim(),
        groomSurname: formState.groomSurname.trim(),
        brideSurname: formState.brideSurname.trim(),
        honeypot: formState.honeypot,
      };

      const response = await fetch(RSVP_ENDPOINT, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || 'Unable to submit RSVP');
      }

      setStatus('success');
      setFormState({
        firstName: '',
        lastName: '',
        phone: '',
        plusOne: false,
        plusOneName: '',
        notes: '',
        groomSurname: '',
        brideSurname: '',
        honeypot: '',
      });
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'We could not submit your RSVP.'
      );
    }
  };

  return (
    <section
      id="rsvp"
      ref={sectionRef}
      aria-labelledby="rsvp-heading"
      style={{
        backgroundColor: theme.colors.background.offWhite,
        padding: `${theme.spacing['4xl']} ${theme.spacing.lg}`,
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <h2
          id="rsvp-heading"
          className="font-serif"
          style={{
            fontFamily: theme.typography.fontFamily.serif,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary.dustyBlue,
            marginBottom: theme.spacing.lg,
          }}
        >
          {headingText}
        </h2>

        <p
          className="font-sans"
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing['2xl'],
          }}
        >
          {deadlineText}
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            textAlign: 'left',
            backgroundColor: theme.colors.background.white,
            borderRadius: theme.borderRadius['2xl'],
            padding: theme.spacing['2xl'],
            boxShadow: theme.shadows.md,
            border: `1px solid ${theme.colors.primary.dustyBlue}20`,
            marginBottom: theme.spacing['2xl'],
          }}
        >
          <div
            style={{
              display: 'grid',
              gap: theme.spacing.lg,
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            }}
          >
            <label style={{ fontFamily: theme.typography.fontFamily.sans }}>
              First Name
              <input
                type="text"
                required
                value={formState.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={{ fontFamily: theme.typography.fontFamily.sans }}>
              Last Name
              <input
                type="text"
                required
                value={formState.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                style={inputStyle}
              />
            </label>
          </div>

          <label
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              display: 'block',
              marginTop: theme.spacing.lg,
            }}
          >
            Mobile Number
            <input
              type="tel"
              required
              value={formState.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              style={inputStyle}
            />
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              marginTop: theme.spacing.lg,
              fontFamily: theme.typography.fontFamily.sans,
            }}
          >
            <input
              type="checkbox"
              checked={formState.plusOne}
              onChange={(e) => handleChange('plusOne', e.target.checked)}
            />
            Bringing a plus one?
          </label>

          {formState.plusOne && (
            <label
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                display: 'block',
                marginTop: theme.spacing.sm,
              }}
            >
              Plus One Name
              <input
                type="text"
                value={formState.plusOneName}
                onChange={(e) => handleChange('plusOneName', e.target.value)}
                style={inputStyle}
              />
            </label>
          )}

          <label
            style={{ fontFamily: theme.typography.fontFamily.sans, display: 'block', marginTop: theme.spacing.lg }}
          >
            Notes (dietary or other)
            <textarea
              value={formState.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
            />
          </label>

          <div
            style={{
              display: 'grid',
              gap: theme.spacing.sm,
              marginTop: theme.spacing['2xl'],
            }}
          >
            <label style={{ fontFamily: theme.typography.fontFamily.sans }}>
              Groom&apos;s last name? (Họ chú rể)
              <input
                type="text"
                required
                value={formState.groomSurname}
                onChange={(e) => handleChange('groomSurname', e.target.value)}
                placeholder="Ví dụ: Le"
                style={inputStyle}
              />
            </label>
            <label style={{ fontFamily: theme.typography.fontFamily.sans }}>
              Bride&apos;s last name? (Họ cô dâu)
              <input
                type="text"
                required
                value={formState.brideSurname}
                onChange={(e) => handleChange('brideSurname', e.target.value)}
                placeholder="Ví dụ: Chiu"
                style={inputStyle}
              />
            </label>
          </div>

          <div style={{ display: 'none' }}>
            <label>
              Leave this blank
              <input
                type="text"
                value={formState.honeypot}
                onChange={(e) => handleChange('honeypot', e.target.value)}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || status === 'submitting'}
            style={{
              marginTop: theme.spacing['2xl'],
              width: '100%',
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              borderRadius: theme.borderRadius.xl,
              border: 'none',
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.semibold,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              backgroundColor: theme.colors.primary.dustyBlue,
              color: theme.colors.text.inverse,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              opacity: status === 'submitting' ? 0.7 : 1,
            }}
          >
            {status === 'submitting' ? 'Sending...' : 'Submit RSVP'}
          </button>

          {status === 'success' && (
            <p
              style={{
                marginTop: theme.spacing.md,
                color: theme.colors.primary.dustyBlue,
                fontFamily: theme.typography.fontFamily.sans,
              }}
            >
              Thank you! Your RSVP has been received.
            </p>
          )}

          {status === 'error' && (
            <p
              style={{
                marginTop: theme.spacing.md,
                color: theme.colors.secondary.slate,
                fontFamily: theme.typography.fontFamily.sans,
              }}
            >
              {errorMessage ?? 'We could not submit your RSVP. Please email us.'}
            </p>
          )}
        </form>

        <div
          style={{
            marginTop: theme.spacing['2xl'],
            paddingTop: theme.spacing.xl,
            borderTop: `1px solid ${theme.colors.primary.dustyBlue}30`,
          }}
        >
          <p
            className="font-sans"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.normal,
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing.sm,
            }}
          >
            {strings.rsvp.havingTrouble}
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.xs,
              alignItems: 'center',
            }}
          >
            <p
              className="font-sans"
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.normal,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.sm,
              }}
            >
              {strings.rsvp.contactHint}
            </p>
            {emails.map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="link-hover"
                style={{
                  fontFamily: theme.typography.fontFamily.sans,
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.primary.dustyBlue,
                  display: 'inline-block',
                }}
              >
                {email}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const inputStyle: CSSProperties = {
  width: '100%',
  marginTop: '0.5rem',
  padding: '0.75rem 1rem',
  borderRadius: '14px',
  border: '1px solid rgba(139,157,195,0.4)',
  fontSize: '1rem',
  fontFamily: 'inherit',
  backgroundColor: '#fff',
};
