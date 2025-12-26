import { useMemo, useState } from 'react';
import { theme } from '../theme';
import { RSVP_ENDPOINTS } from '../api/rsvp';

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

const errorColor = '#B3261E';

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
    <section
      className="hero-opener__fade-item"
      style={{
        border: `1px solid ${theme.colors.primary.dustyBlue}30`,
        borderRadius: theme.borderRadius['2xl'],
        padding: theme.spacing['2xl'],
        backgroundColor: theme.colors.background.white,
        marginTop: theme.spacing['3xl'],
        textAlign: 'left',
      }}
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: theme.spacing.lg,
          }}
        >
          <FormField
            label="First name"
            id="intent-first-name"
            value={formState.firstName}
            onChange={(value) => handleChange('firstName', value)}
            required
            error={errors.firstName}
          />
          <FormField
            label="Last name"
            id="intent-last-name"
            value={formState.lastName}
            onChange={(value) => handleChange('lastName', value)}
            required
            error={errors.lastName}
          />
        </div>

        <FormField
          label="Mobile number"
          id="intent-phone"
          type="tel"
          inputMode="tel"
          value={formState.phone}
          onChange={(value) => handleChange('phone', value)}
          required
          error={errors.phone}
          placeholder="04XX XXX XXX"
        />

        <label
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.sm,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: theme.colors.secondary.slate,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.xs,
          }}
        >
          Likely to attend? (optional)
          <select
            value={formState.likely}
            onChange={(event) => handleChange('likely', event.target.value as LikelyValue)}
            style={{
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.primary.dustyBlue}40`,
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.text.primary,
              backgroundColor: theme.colors.background.white,
            }}
          >
            <option value="">Select one (optional)</option>
            <option value="YES">Yes</option>
            <option value="MAYBE">Maybe</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={status === 'submitting'}
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.sm,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: `${theme.spacing.sm} ${theme.spacing['2xl']}`,
            borderRadius: theme.borderRadius.full,
            border: 'none',
            backgroundColor: theme.colors.primary.dustyBlue,
            color: theme.colors.text.inverse,
            cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
            minHeight: '44px',
            transition: `opacity ${theme.transitions.base}`,
            opacity: status === 'submitting' ? 0.7 : 1,
          }}
        >
          {status === 'submitting' ? 'Sending…' : 'Send me updates'}
        </button>

        <p
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.xs,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: theme.colors.secondary.slate,
            textAlign: 'center',
          }}
        >
          We’ll only use your details for wedding updates.
        </p>

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
          {submitError && (
            <p
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                fontSize: theme.typography.fontSize.sm,
                color: errorColor,
                textAlign: 'center',
              }}
            >
              {submitError}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  required?: boolean;
  error?: string;
  placeholder?: string;
}

function FormField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  inputMode,
  required,
  error,
  placeholder,
}: FormFieldProps) {
  return (
    <label
      htmlFor={id}
      style={{
        fontFamily: theme.typography.fontFamily.sans,
        fontSize: theme.typography.fontSize.sm,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: theme.colors.secondary.slate,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.xs,
      }}
    >
      <span>
        {label}
        {required ? ' *' : ''}
      </span>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        style={{
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${error ? errorColor : `${theme.colors.primary.dustyBlue}40`}`,
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          fontFamily: theme.typography.fontFamily.sans,
          fontSize: theme.typography.fontSize.base,
          color: theme.colors.text.primary,
          outline: 'none',
        }}
      />
      {error && (
        <span
          style={{
            color: errorColor,
            fontSize: theme.typography.fontSize.xs,
            letterSpacing: '0.05em',
            textTransform: 'none',
          }}
        >
          {error}
        </span>
      )}
    </label>
  );
}
