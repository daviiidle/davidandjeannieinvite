import type { CSSProperties, ReactNode } from 'react';
import { theme } from '../theme';

export const FORM_ERROR_COLOR = '#B3261E';

const cardStyle: CSSProperties = {
  border: `1px solid ${theme.colors.primary.dustyBlue}30`,
  borderRadius: theme.borderRadius['2xl'],
  padding: theme.spacing['2xl'],
  backgroundColor: theme.colors.background.white,
  boxShadow: theme.shadows.md,
  width: '100%',
  maxWidth: '760px',
  margin: '0 auto',
};

const labelStyle: CSSProperties = {
  fontFamily: theme.typography.fontFamily.sans,
  fontSize: theme.typography.fontSize.sm,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: theme.colors.secondary.slate,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xs,
};

const helperTextStyle: CSSProperties = {
  fontFamily: theme.typography.fontFamily.sans,
  fontSize: theme.typography.fontSize.xs,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: theme.colors.secondary.slate,
  opacity: 0.85,
};

const errorTextStyle: CSSProperties = {
  fontFamily: theme.typography.fontFamily.sans,
  fontSize: theme.typography.fontSize.xs,
  color: FORM_ERROR_COLOR,
};

const baseInputStyle = (hasError?: boolean): CSSProperties => ({
  borderRadius: theme.borderRadius.lg,
  border: `1px solid ${hasError ? FORM_ERROR_COLOR : `${theme.colors.primary.dustyBlue}40`}`,
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  fontFamily: theme.typography.fontFamily.sans,
  fontSize: theme.typography.fontSize.base,
  color: theme.colors.text.primary,
  backgroundColor: theme.colors.background.white,
  minHeight: '44px',
  outline: 'none',
  width: '100%',
});

export function FormCard({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <section className={className} style={{ ...cardStyle, ...style }}>
      {children}
    </section>
  );
}

export function FormGrid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: theme.spacing.lg,
      }}
    >
      {children}
    </div>
  );
}

export function FormField({
  label,
  htmlFor,
  required,
  helperText,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  helperText?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
      <label htmlFor={htmlFor} style={labelStyle}>
        <span>
          {label}
          {required ? ' *' : ''}
        </span>
        {children}
      </label>
      {helperText && <span style={helperTextStyle}>{helperText}</span>}
      {error && <span style={errorTextStyle}>{error}</span>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function FormInput({ hasError, style, className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={['form-input', className].filter(Boolean).join(' ')}
      style={{ ...baseInputStyle(hasError), ...style }}
    />
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export function FormTextarea({ hasError, style, className, ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      className={['form-textarea', className].filter(Boolean).join(' ')}
      style={{
        ...baseInputStyle(hasError),
        minHeight: '100px',
        resize: 'vertical',
        ...style,
      }}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export function FormSelect({ hasError, style, className, children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={['form-select', className].filter(Boolean).join(' ')}
      style={{ ...baseInputStyle(hasError), ...style }}
    >
      {children}
    </select>
  );
}

export function FormLegend({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontFamily: theme.typography.fontFamily.sans,
        fontSize: theme.typography.fontSize.sm,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: theme.colors.secondary.slate,
        marginBottom: theme.spacing.sm,
      }}
    >
      {children}
    </p>
  );
}

export function FormHelperText({ children }: { children: ReactNode }) {
  return <p style={helperTextStyle}>{children}</p>;
}

export function FormErrorText({ children }: { children: ReactNode }) {
  return <p style={errorTextStyle}>{children}</p>;
}

export function PrimaryButton({
  children,
  style,
  className,
  fullWidth,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { fullWidth?: boolean }) {
  return (
    <button
      {...props}
      className={['form-primary-button', className].filter(Boolean).join(' ')}
      style={{
        fontFamily: theme.typography.fontFamily.sans,
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.medium,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        padding: `${theme.spacing.sm} ${theme.spacing['2xl']}`,
        borderRadius: theme.borderRadius.full,
        border: 'none',
        backgroundColor: theme.colors.primary.dustyBlue,
        color: theme.colors.text.inverse,
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        minHeight: '44px',
        alignSelf: fullWidth ? 'stretch' : 'flex-start',
        width: fullWidth ? '100%' : 'auto',
        opacity: props.disabled ? 0.7 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function RadioOption({
  children,
  style: radioStyle,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { children: ReactNode }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
        fontFamily: theme.typography.fontFamily.sans,
        fontSize: theme.typography.fontSize.sm,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: theme.colors.secondary.slate,
        cursor: 'pointer',
      }}
    >
      <input
        type="radio"
        {...props}
        style={{
          accentColor: theme.colors.primary.dustyBlue,
          ...(radioStyle as CSSProperties | undefined),
        }}
      />
      <span>{children}</span>
    </label>
  );
}
