import { useMemo, useState } from 'react';
import { theme } from '../theme';
import { RSVP_ENDPOINTS } from '../api/rsvp';
import {
  FormCard,
  FormField,
  FormGrid,
  FormInput,
  FormSelect,
  FormHelperText,
  FormErrorText,
  PrimaryButton,
} from './FormPrimitives';

type LikelyValue = '' | 'YES' | 'MAYBE';

interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
  likely: LikelyValue;
}

const PHONE_REGEX = /^(\+61\d{9}|61\d{9}|04\d{8})$/;
const initialState: FormState = {
  firstName: '',
  lastName: '',
  phone: '',
  likely: '',
};

const sanitizePhone = (value: string) => value.replace(/[^\d+]/g, '');
const normalizePhone = (value: string) => value.replace(/[^\d]/g, '');

export function StayInLoopForm() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isPhoneValid = useMemo(
    () => PHONE_REGEX.test(sanitizePhone(formState.phone.trim())),
    [formState.phone]
  );

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validate = (): Partial<Record<keyof FormState, string>> => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!formState.firstName.trim()) {
      nextErrors.firstName = 'First name is required.';
    }
    if (!formState.lastName.trim()) {
      nextErrors.lastName = 'Last name is required.';
    }
    if (!formState.phone.trim() || !isPhoneValid) {
      nextErrors.phone = 'Enter a valid Australian mobile number.';
    }
    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0 || status === 'submitting') {
      return;
    }

    if (!RSVP_ENDPOINTS.intent) {
      setSubmitError('Unable to send right now. Please try again later.');
      return;
    }

    setStatus('submitting');
    setSubmitError(null);

    try {
      const phoneSanitized = sanitizePhone(formState.phone.trim());
      const payload = {
        firstName: formState.firstName.trim(),
        lastName: formState.lastName.trim(),
        phone: phoneSanitized,
        phoneNormalized: normalizePhone(phoneSanitized),
        likelyToAttend: formState.likely || undefined,
        source: 'SAVE_THE_DATE',
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(RSVP_ENDPOINTS.intent, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || 'Unable to send your details.');
      }

      setStatus('success');
      setErrors({});
      setFormState(initialState);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
      setStatus('idle');
    }
  };

  return (
    <FormCard
      className="hero-opener__fade-item"
      style={{ marginTop: theme.spacing['3xl'], textAlign: 'left' }}
    >
      <div
        style={{
          textAlign: 'center',
          marginBottom: theme.spacing['2xl'],
        }}
      >
        <p
          style={{
            fontFamily: theme.typography.fontFamily.serif,
            fontSize: theme.typography.fontSize['2xl'],
            color: theme.colors.primary.dustyBlue,
            marginBottom: theme.spacing.xs,
          }}
        >
          Want to stay in the loop?
        </p>
        <p
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Leave your name and number so we can keep you updated. This is not a formal RSVP.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.lg,
        }}
      >
        <FormGrid>
          <FormField
            label="First name"
            htmlFor="intent-first-name"
            required
            error={errors.firstName}
          >
            <FormInput
              id="intent-first-name"
              value={formState.firstName}
              onChange={(event) => handleChange('firstName', event.target.value)}
              required
              hasError={Boolean(errors.firstName)}
            />
          </FormField>
          <FormField
            label="Last name"
            htmlFor="intent-last-name"
            required
            error={errors.lastName}
          >
            <FormInput
              id="intent-last-name"
              value={formState.lastName}
              onChange={(event) => handleChange('lastName', event.target.value)}
              required
              hasError={Boolean(errors.lastName)}
            />
          </FormField>
        </FormGrid>

        <FormField
          label="Mobile number"
          htmlFor="intent-phone"
          required
          error={errors.phone}
          helperText="Use an Australian mobile number"
        >
          <FormInput
            id="intent-phone"
            type="tel"
            inputMode="tel"
            placeholder="04XX XXX XXX"
            value={formState.phone}
            onChange={(event) => handleChange('phone', event.target.value)}
            hasError={Boolean(errors.phone)}
            required
          />
        </FormField>

        <FormField label="Likely to attend? (optional)" htmlFor="intent-likely">
          <FormSelect
            id="intent-likely"
            value={formState.likely}
            onChange={(event) => handleChange('likely', event.target.value as LikelyValue)}
          >
            <option value="">Select one (optional)</option>
            <option value="YES">Yes</option>
            <option value="MAYBE">Maybe</option>
          </FormSelect>
        </FormField>

        <PrimaryButton type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Send me updates'}
        </PrimaryButton>

        <FormHelperText>
          We’ll only use your details for wedding updates.
        </FormHelperText>

        <div aria-live="polite">
          {status === 'success' && (
            <p
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.primary.dustyBlue,
                textAlign: 'center',
              }}
            >
              Thanks! We’ll keep you posted.
            </p>
          )}
          {submitError && <FormErrorText>{submitError}</FormErrorText>}
        </div>
      </form>
    </FormCard>
  );
}
