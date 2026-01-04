import { useRef, useState, useCallback } from 'react';
import { theme } from '../theme';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLanguage } from '../context/useLanguage';
import { RSVP_ENDPOINTS } from '../api/rsvp';
import {
  FormCard,
  FormField,
  FormGrid,
  FormHelperText,
  FormInput,
  FormLegend,
  FormTextarea,
  PrimaryButton,
  RadioOption,
  FormErrorText,
} from './FormPrimitives';
import { Section } from './Section';

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

export function RSVP({
  heading,
  deadline,
  emails = ['daviiidle@gmail.com', 'jheea05@gmail.com'],
}: RSVPProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const activateTitleAnimation = useCallback(() => {
    headingRef.current?.classList.add('page-title-handwriting--active');
  }, []);
  useScrollReveal(sectionRef, { duration: 0.7, onEnter: activateTitleAnimation });
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

      const response = await fetch(RSVP_ENDPOINTS.submit, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || 'Unable to submit RSVP');
      }

      setStatus('success');
      setSuccessHint('We just sent a private View/Edit link via SMS.');
      setShowValidation(false);
      setFormState(createDefaultFormState());
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'We could not submit your RSVP.'
      );
    }
  };

  return (
    <Section
      id="rsvp"
      ref={sectionRef}
      aria-labelledby="rsvp-heading"
      className="page-rsvp"
      style={{
        backgroundColor: theme.colors.background.white,
      }}
      maxWidth={760}
      innerStyle={{ textAlign: 'center' }}
    >
        <div className="rsvp-header">
          <h2
            id="rsvp-heading"
            ref={headingRef}
            className="font-serif page-title-handwriting"
            style={{
              fontFamily: '"Playball", "Playfair Display", serif',
              fontSize: theme.typography.heading.h2,
              fontWeight: 400,
              color: theme.colors.primary.dustyBlue,
              letterSpacing: '0.05em',
              marginBottom: theme.spacing.md,
              lineHeight: 1.2,
              paddingTop: '0.2em',
              paddingBottom: '0.1em',
              overflow: 'visible',
            }}
          >
            <span
              className="hero-handwriting hero-handwriting--loose"
              style={{
                lineHeight: 1.2,
                paddingTop: '0.1em',
                overflow: 'visible',
              }}
            >
              <span className="hero-handwriting__text">{headingText}</span>
              {'\u00A0\u00A0'}
            </span>
          </h2>

          <p
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.sm,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: theme.colors.primary.dustyBlue,
              marginBottom: theme.spacing.sm,
            }}
          >
            {deadlineText}
          </p>

          <p
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.xs,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing['2xl'],
              whiteSpace: 'pre-wrap',
            }}
          >
            {t.adultNote}
          </p>
        </div>

        <FormCard className="rsvp-card" style={{ marginBottom: theme.spacing['2xl'] }}>
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.lg,
            }}
          >
            <input type="hidden" name="language" value={hiddenLanguageValue} readOnly />
            <FormGrid>
              <FormField
                label={t.firstNameLabel}
                htmlFor="rsvp-first-name"
                required
                error={firstNameError}
              >
                <FormInput
                  id="rsvp-first-name"
                  required
                  value={formState.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  hasError={Boolean(firstNameError)}
                />
              </FormField>
              <FormField
                label={t.lastNameLabel}
                htmlFor="rsvp-last-name"
                required
                error={lastNameError}
              >
                <FormInput
                  id="rsvp-last-name"
                  required
                  value={formState.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  hasError={Boolean(lastNameError)}
                />
              </FormField>
            </FormGrid>

            <FormField label={t.householdNameLabel} htmlFor="rsvp-household">
              <FormInput
                id="rsvp-household"
                placeholder={t.householdNamePlaceholder}
                value={formState.householdName}
                onChange={(e) => handleChange('householdName', e.target.value)}
              />
            </FormField>

            <FormField
              label={t.phoneLabel}
              htmlFor="rsvp-phone"
              required
              helperText={t.phoneHelper}
              error={phoneError}
            >
              <FormInput
                id="rsvp-phone"
                type="tel"
                required
                value={formState.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                hasError={Boolean(phoneError)}
              />
            </FormField>

            <div style={{ marginTop: theme.spacing.xl }}>
              <FormLegend>{t.attendanceQuestion}</FormLegend>
              {attendanceError && <FormErrorText>{attendanceError}</FormErrorText>}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing.sm,
                }}
              >
                <RadioOption
                  name="attendance"
                  value="YES"
                  required
                  checked={formState.attendance === 'YES'}
                  onChange={(e) => handleChange('attendance', e.target.value)}
                >
                  {t.attendanceYes}
                </RadioOption>
                <RadioOption
                  name="attendance"
                  value="NO"
                  checked={formState.attendance === 'NO'}
                  onChange={(e) => handleChange('attendance', e.target.value)}
                >
                  {t.attendanceNo}
                </RadioOption>
              </div>
            </div>

            <FormField label={t.emailLabel} htmlFor="rsvp-email" error={emailError}>
              <FormInput
                id="rsvp-email"
                type="email"
                value={formState.email}
                onChange={(e) => handleChange('email', e.target.value)}
                hasError={Boolean(emailError)}
              />
            </FormField>

            {isAttending && (
              <>
                <FormField
                  label={t.partySizeLabel}
                  htmlFor="rsvp-party-size"
                  helperText={t.partySizeHelper}
                  error={partySizeError}
                >
                  <FormInput
                    id="rsvp-party-size"
                    type="number"
                    min={0}
                    max={10}
                    value={formState.partySize}
                    onChange={(e) => handleChange('partySize', e.target.value)}
                    hasError={Boolean(partySizeError)}
                  />
                </FormField>

                <FormField
                  label={t.otherGuestNamesLabel}
                  htmlFor="rsvp-other-guests"
                >
                  <FormTextarea
                    id="rsvp-other-guests"
                    value={formState.otherGuestNames}
                    onChange={(e) => handleChange('otherGuestNames', e.target.value)}
                    placeholder={t.otherGuestNamesPlaceholder}
                    style={{ minHeight: '80px' }}
                  />
                </FormField>
              </>
            )}

            <FormField label={t.notesLabel} htmlFor="rsvp-notes">
              <FormTextarea
                id="rsvp-notes"
                value={formState.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </FormField>

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

            <PrimaryButton type="submit" disabled={!canSubmit || status === 'submitting'} fullWidth>
              {status === 'submitting' ? t.buttonSubmitting : t.button}
            </PrimaryButton>

            {status === 'success' && (
              <p
                style={{
                  color: theme.colors.primary.dustyBlue,
                  fontFamily: theme.typography.fontFamily.sans,
                }}
                aria-live="polite"
              >
                {t.successMessage}
              </p>
            )}
            {status === 'success' && successHint && (
              <FormHelperText>{successHint}</FormHelperText>
            )}

            {status === 'error' && (
              <FormErrorText>
                {errorMessage ?? 'We could not submit your RSVP. Please email us.'}
              </FormErrorText>
            )}
          </form>
        </FormCard>

        <div
          style={{
            marginTop: theme.spacing['2xl'],
            paddingTop: theme.spacing.xl,
            borderTop: `1px solid ${theme.colors.primary.dustyBlue}30`,
            textAlign: 'center',
          }}
        >
          <FormHelperText>{strings.rsvp.havingTrouble}</FormHelperText>
          <p
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing.sm,
            }}
          >
            {strings.rsvp.contactHint}
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.xs,
              alignItems: 'center',
            }}
          >
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
    </Section>
  );
}
