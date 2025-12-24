import { useRef, useState, type CSSProperties } from 'react';
import { theme } from '../theme';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLanguage } from '../context/LanguageContext';

interface RSVPProps {
  heading?: string;
  deadline?: string;
  emails?: string[];
}

type AttendanceValue = 'YES' | 'NO' | '';

interface FormState {
  firstName: string;
  lastName: string;
  householdName: string;
  phone: string;
  email: string;
  attendance: AttendanceValue;
  partySize: string;
  otherGuestNames: string;
  notes: string;
  honeypot: string;
}

const createDefaultFormState = (): FormState => ({
  firstName: '',
  lastName: '',
  householdName: '',
  phone: '',
  email: '',
  attendance: '',
  partySize: '1',
  otherGuestNames: '',
  notes: '',
  honeypot: '',
});

const RSVP_ENDPOINT =
  import.meta.env.VITE_RSVP_ENDPOINT ??
  'https://script.google.com/macros/s/AKfycbyjQw5j5lYh5ZUPJ13kk4mfJ6AXPqs93haPmKI5W9lzhMCdYI5p-gU5QVQz8tuWyuRITw/exec';

const errorColor = '#B3261E';

export function RSVP({
  heading,
  deadline,
  emails = ['daviiidle@gmail.com', 'jheea05@gmail.com'],
}: RSVPProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, { duration: 0.7 });
  const { strings, language } = useLanguage();
  const headingText = heading ?? strings.rsvp.heading;
  const deadlineText = deadline ?? strings.rsvp.deadline;
  const t = strings.rsvp;
  const hiddenLanguageValue = language === 'vi' ? 'VI' : 'EN';

  const [formState, setFormState] = useState<FormState>(createDefaultFormState());

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successHint, setSuccessHint] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => {
      if (field === 'attendance') {
        const nextAttendance = value as AttendanceValue;
        const nextPartySize =
          nextAttendance === 'YES'
            ? prev.partySize && prev.partySize !== '0'
              ? prev.partySize
              : '1'
            : '0';
        return {
          ...prev,
          attendance: nextAttendance,
          partySize: nextPartySize,
          otherGuestNames: nextAttendance === 'YES' ? prev.otherGuestNames : '',
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const phoneSanitized = formState.phone.replace(/[^\d+]/g, '');
  const isPhoneValid = /^(\+61\d{9}|61\d{9}|04\d{8})$/.test(phoneSanitized);
  const emailValue = formState.email.trim();
  const isEmailValid =
    !emailValue || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

  const isAttending = formState.attendance === 'YES';
  const partySizeValue = isAttending ? Number(formState.partySize || '0') : 0;
  const isPartySizeValid =
    !isAttending ||
    (!Number.isNaN(partySizeValue) && partySizeValue >= 0 && partySizeValue <= 10);

  const canSubmit =
    formState.firstName.trim() &&
    formState.lastName.trim() &&
    isPhoneValid &&
    formState.attendance &&
    isPartySizeValid &&
    isEmailValid;

  const firstNameError = showValidation && !formState.firstName.trim() ? t.firstNameError : null;
  const lastNameError = showValidation && !formState.lastName.trim() ? t.lastNameError : null;
  const phoneError = showValidation && !isPhoneValid ? t.phoneError : null;
  const attendanceError = showValidation && !formState.attendance ? t.attendanceError : null;
  const partySizeError = showValidation && !isPartySizeValid ? t.partySizeError : null;
  const emailError = showValidation && !isEmailValid ? t.emailError : null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!showValidation) {
      setShowValidation(true);
    }
    if (!canSubmit || status === 'submitting') return;

    setStatus('submitting');
    setErrorMessage(null);

    try {
      const payload = {
        firstName: formState.firstName.trim(),
        lastName: formState.lastName.trim(),
        householdName: formState.householdName.trim(),
        phone: phoneSanitized,
        email: formState.email.trim(),
        language: hiddenLanguageValue,
        attendance: formState.attendance || 'NO',
        partySize: isAttending ? partySizeValue : 0,
        otherGuestNames: isAttending ? formState.otherGuestNames.trim() : '',
        notes: formState.notes.trim(),
        honeypot: formState.honeypot,
      };

      const response = await fetch(RSVP_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });

      if (response.type !== 'opaque') {
        try {
          const result = await response.json();
          if (!response.ok || !result?.ok) {
            throw new Error(result?.error || 'Unable to submit RSVP');
          }
        } catch (err) {
          // ignore parse errors for opaque responses
        }
      }

      setStatus('success');
      setSuccessHint(null);
      setShowValidation(false);
      setFormState(createDefaultFormState());
    } catch (error) {
      if (error instanceof TypeError) {
        console.warn('RSVP submission succeeded but response was blocked.', error);
        setStatus('success');
        setSuccessHint(t.networkFallbackMessage);
        setErrorMessage(null);
        setShowValidation(false);
        setFormState(createDefaultFormState());
        return;
      }
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
            marginBottom: theme.spacing.md,
          }}
        >
          {deadlineText}
        </p>

        <p
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.secondary.slate,
            marginBottom: theme.spacing['2xl'],
            whiteSpace: 'pre-wrap',
          }}
        >
          {t.adultNote}
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
          <input type="hidden" name="language" value={hiddenLanguageValue} readOnly />
          <div
            style={{
              display: 'grid',
              gap: theme.spacing.lg,
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            }}
          >
            <label style={{ fontFamily: theme.typography.fontFamily.sans }}>
              {t.firstNameLabel}
              <input
                type="text"
                required
                value={formState.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                style={inputStyle}
              />
              {firstNameError && (
                <span
                  style={{
                    color: errorColor,
                    fontFamily: theme.typography.fontFamily.sans,
                    fontSize: theme.typography.fontSize.xs,
                    marginTop: theme.spacing.xs,
                    display: 'block',
                  }}
                >
                  {firstNameError}
                </span>
              )}
            </label>
            <label style={{ fontFamily: theme.typography.fontFamily.sans }}>
              {t.lastNameLabel}
              <input
                type="text"
                required
                value={formState.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                style={inputStyle}
              />
              {lastNameError && (
                <span
                  style={{
                    color: errorColor,
                    fontFamily: theme.typography.fontFamily.sans,
                    fontSize: theme.typography.fontSize.xs,
                    marginTop: theme.spacing.xs,
                    display: 'block',
                  }}
                >
                  {lastNameError}
                </span>
              )}
            </label>
          </div>

          <label
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              display: 'block',
              marginTop: theme.spacing.lg,
            }}
          >
            {t.householdNameLabel}
            <input
              type="text"
              placeholder={t.householdNamePlaceholder}
              value={formState.householdName}
              onChange={(e) => handleChange('householdName', e.target.value)}
              style={inputStyle}
            />
          </label>

          <label
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              display: 'block',
              marginTop: theme.spacing.lg,
            }}
          >
            {t.phoneLabel}
            <input
              type="tel"
              required
              value={formState.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              style={inputStyle}
            />
            <span
              style={{
                display: 'block',
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.secondary,
                marginTop: theme.spacing.xs,
              }}
            >
              {t.phoneHelper}
            </span>
            {phoneError && (
              <span
                style={{
                  color: errorColor,
                  fontFamily: theme.typography.fontFamily.sans,
                  fontSize: theme.typography.fontSize.xs,
                  marginTop: theme.spacing.xs,
                  display: 'block',
                }}
              >
                {phoneError}
              </span>
            )}
          </label>

          <div
            style={{
              marginTop: theme.spacing['2xl'],
            }}
          >
            <p
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                fontWeight: theme.typography.fontWeight.medium,
                marginBottom: theme.spacing.sm,
                color: theme.colors.text.primary,
              }}
            >
              {t.attendanceQuestion}
            </p>
            {attendanceError && (
              <p
                style={{
                  fontFamily: theme.typography.fontFamily.sans,
                  color: errorColor,
                  fontSize: theme.typography.fontSize.xs,
                  marginBottom: theme.spacing.sm,
                }}
              >
                {attendanceError}
              </p>
            )}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.sm,
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                  fontFamily: theme.typography.fontFamily.sans,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="attendance"
                  value="YES"
                  required
                  checked={formState.attendance === 'YES'}
                  onChange={(e) => handleChange('attendance', e.target.value)}
                />
                <span>{t.attendanceYes}</span>
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                  fontFamily: theme.typography.fontFamily.sans,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="attendance"
                  value="NO"
                  checked={formState.attendance === 'NO'}
                  onChange={(e) => handleChange('attendance', e.target.value)}
                />
                <span>{t.attendanceNo}</span>
              </label>
            </div>
          </div>

          <label
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              display: 'block',
              marginTop: theme.spacing.lg,
            }}
          >
            {t.emailLabel}
            <input
              type="email"
              value={formState.email}
              onChange={(e) => handleChange('email', e.target.value)}
              style={inputStyle}
            />
            {emailError && (
              <span
                style={{
                  color: errorColor,
                  fontFamily: theme.typography.fontFamily.sans,
                  fontSize: theme.typography.fontSize.xs,
                  marginTop: theme.spacing.xs,
                  display: 'block',
                }}
              >
                {emailError}
              </span>
            )}
          </label>

          {isAttending && (
            <>
              <label
                style={{
                  fontFamily: theme.typography.fontFamily.sans,
                  display: 'block',
                  marginTop: theme.spacing.lg,
                }}
              >
                {t.partySizeLabel}
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={formState.partySize}
                  onChange={(e) => handleChange('partySize', e.target.value)}
                  style={inputStyle}
                />
                <span
                  style={{
                    display: 'block',
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.secondary,
                    marginTop: theme.spacing.xs,
                  }}
                >
                  {t.partySizeHelper}
                </span>
                {partySizeError && (
                  <span
                    style={{
                      color: errorColor,
                      fontFamily: theme.typography.fontFamily.sans,
                      fontSize: theme.typography.fontSize.xs,
                      marginTop: theme.spacing.xs,
                      display: 'block',
                    }}
                  >
                    {partySizeError}
                  </span>
                )}
              </label>

              <label
                style={{
                  fontFamily: theme.typography.fontFamily.sans,
                  display: 'block',
                  marginTop: theme.spacing.lg,
                }}
              >
                {t.otherGuestNamesLabel}
                <textarea
                  value={formState.otherGuestNames}
                  onChange={(e) => handleChange('otherGuestNames', e.target.value)}
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  placeholder={t.otherGuestNamesPlaceholder}
                />
              </label>
            </>
          )}

          <label
            style={{ fontFamily: theme.typography.fontFamily.sans, display: 'block', marginTop: theme.spacing.lg }}
          >
            {t.notesLabel}
            <textarea
              value={formState.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
            />
          </label>

          <div style={{ display: 'none' }} aria-hidden="true">
            <label>
              Do not fill this field
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
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
            {status === 'submitting' ? t.buttonSubmitting : t.button}
          </button>

          {status === 'success' && (
            <p
              style={{
                marginTop: theme.spacing.md,
                color: theme.colors.primary.dustyBlue,
                fontFamily: theme.typography.fontFamily.sans,
              }}
              aria-live="polite"
            >
              {t.successMessage}
            </p>
          )}
          {status === 'success' && successHint && (
            <p
              style={{
                marginTop: theme.spacing.xs,
                color: theme.colors.secondary.slate,
                fontFamily: theme.typography.fontFamily.sans,
                fontSize: theme.typography.fontSize.sm,
              }}
            >
              {successHint}
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
