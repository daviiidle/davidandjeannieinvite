import { useMemo, useState } from 'react';
import { theme } from '../theme';
import { SAVE_THE_DATE_WEBHOOK_URL } from '../api/rsvp';
import { useLanguage } from '../context/LanguageContext';
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
type FormErrors = Partial<Record<keyof FormState, boolean>>;
type SubmitErrorKey = 'unavailable' | 'generic';
type SubmitErrorState =
  | { key: SubmitErrorKey; message?: undefined }
  | { key?: undefined; message: string }
  | null;

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
const GENERIC_ERROR_TOKEN = '__GENERIC__';

export function StayInLoopForm() {
  const { strings } = useLanguage();
  const stayInLoop = strings.stayInLoop;
  const [formState, setFormState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<SubmitErrorState>(null);

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

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!formState.firstName.trim()) {
      nextErrors.firstName = true;
    }
    if (!formState.lastName.trim()) {
      nextErrors.lastName = true;
    }
    if (!formState.phone.trim() || !isPhoneValid) {
      nextErrors.phone = true;
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

    if (!SAVE_THE_DATE_WEBHOOK_URL) {
      setSubmitError({ key: 'unavailable' });
      return;
    }

    setStatus('submitting');
    setSubmitError(null);

    try {
      const phoneRaw = formState.phone.trim();
      const payload = {
        firstName: formState.firstName.trim(),
        lastName: formState.lastName.trim(),
        phone: phoneRaw,
        likelyToAttend: formState.likely || undefined,
      };

      const response = await fetch(SAVE_THE_DATE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || GENERIC_ERROR_TOKEN);
      }

      setStatus('success');
      setErrors({});
      setFormState(initialState);
      setSubmitError(null);
    } catch (error) {
      if (error instanceof Error && error.message && error.message !== GENERIC_ERROR_TOKEN) {
        setSubmitError({ message: error.message });
      } else {
        setSubmitError({ key: 'generic' });
      }
      setStatus('idle');
    }
  };

  const resolvedSubmitError =
    submitError?.message ||
    (submitError?.key ? stayInLoop.submitErrors[submitError.key] : null);

  return (
    <FormCard
      className="hero-opener__fade-item"
      style={{ marginTop: theme.spacing['2xl'], textAlign: 'left' }}
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
          {stayInLoop.heading}
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
          {stayInLoop.subtitle}
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
            label={stayInLoop.firstNameLabel}
            htmlFor="intent-first-name"
            required
            error={errors.firstName ? stayInLoop.errors.firstName : undefined}
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
            label={stayInLoop.lastNameLabel}
            htmlFor="intent-last-name"
            required
            error={errors.lastName ? stayInLoop.errors.lastName : undefined}
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
          label={stayInLoop.phoneLabel}
          htmlFor="intent-phone"
          required
          error={errors.phone ? stayInLoop.errors.phone : undefined}
          helperText={stayInLoop.phoneHelper}
        >
          <FormInput
            id="intent-phone"
            type="tel"
            inputMode="tel"
            placeholder={stayInLoop.phonePlaceholder}
            value={formState.phone}
            onChange={(event) => handleChange('phone', event.target.value)}
            hasError={Boolean(errors.phone)}
            required
          />
        </FormField>

        <FormField label={stayInLoop.likelyLabel} htmlFor="intent-likely">
          <FormSelect
            id="intent-likely"
            value={formState.likely}
            onChange={(event) => handleChange('likely', event.target.value as LikelyValue)}
          >
            <option value="">{stayInLoop.dropdownPlaceholder}</option>
            <option value="YES">{stayInLoop.optionYes}</option>
            <option value="MAYBE">{stayInLoop.optionMaybe}</option>
          </FormSelect>
        </FormField>

        <PrimaryButton type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? stayInLoop.buttonSubmitting : stayInLoop.buttonIdle}
        </PrimaryButton>

        <FormHelperText>
          {stayInLoop.privacy}
        </FormHelperText>

        <p
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.xs,
            color: `${theme.colors.text.secondary}CC`,
            textAlign: 'center',
            letterSpacing: '0.04em',
          }}
        >
          {stayInLoop.rsvpNote}
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
              {stayInLoop.success}
            </p>
          )}
          {resolvedSubmitError && <FormErrorText>{resolvedSubmitError}</FormErrorText>}
        </div>
      </form>
    </FormCard>
  );
}
