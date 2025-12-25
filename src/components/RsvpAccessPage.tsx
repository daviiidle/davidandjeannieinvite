import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { theme } from '../theme';
import { RSVP_ENDPOINTS, withQueryParams } from '../api/rsvp';

interface RsvpRecord {
  householdName: string;
  firstName: string;
  lastName: string;
  phone: string;
  phoneE164: string;
  email: string;
  language: string;
  attendance: 'YES' | 'NO';
  partySize: number;
  otherGuestNames: string;
  notes: string;
  updatedAt: string | null;
  createdAt: string | null;
  viewUrl: string;
}

interface RsvpAccessPageProps {
  token: string;
}

type SaveState = 'idle' | 'saving' | 'success' | 'error';

interface FormValues {
  attendance: 'YES' | 'NO';
  partySize: string;
  otherGuestNames: string;
  notes: string;
  email: string;
}

const initialFormValues: FormValues = {
  attendance: 'NO',
  partySize: '0',
  otherGuestNames: '',
  notes: '',
  email: '',
};

export function RsvpAccessPage({ token }: RsvpAccessPageProps) {
  const [record, setRecord] = useState<RsvpRecord | null>(null);
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErrorMessage(null);
    setRecord(null);

    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch(withQueryParams(RSVP_ENDPOINTS.fetch, { token }), {
          signal: controller.signal,
        });
        const result = await response.json().catch(() => null);
        if (!response.ok || !result?.ok) {
          throw new Error(result?.error || 'We could not find that RSVP.');
        }
        if (!cancelled) {
          setRecord(result.rsvp as RsvpRecord);
          setLoading(false);
        }
      } catch (error) {
        if (cancelled || (error instanceof DOMException && error.name === 'AbortError')) {
          return;
        }
        setLoading(false);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'This link is no longer available. Please request a new RSVP link.'
        );
      }
    };

    fetchData();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [token]);

  useEffect(() => {
    if (!record) return;
    setFormValues({
      attendance: record.attendance === 'YES' ? 'YES' : 'NO',
      partySize: String(record.partySize ?? 0),
      otherGuestNames: record.otherGuestNames ?? '',
      notes: record.notes ?? '',
      email: record.email ?? '',
    });
  }, [record]);

  const displayName = useMemo(() => {
    if (!record) return '';
    if (record.householdName) {
      return record.householdName;
    }
    const parts = [record.firstName, record.lastName].filter(Boolean);
    return parts.length ? parts.join(' ') : 'Guest';
  }, [record]);

  const lastUpdatedLabel = useMemo(() => {
    if (!record?.updatedAt) return null;
    const date = new Date(record.updatedAt);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    return date.toLocaleString();
  }, [record?.updatedAt]);

  const handleAttendanceChange = (value: 'YES' | 'NO') => {
    setFormValues((prev) => ({
      ...prev,
      attendance: value,
      partySize: value === 'YES' ? (prev.partySize === '0' ? '1' : prev.partySize) : '0',
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!record) return;
    setSaveState('saving');
    setSaveMessage(null);
    setErrorMessage(null);

    const parsedPartySize =
      formValues.attendance === 'YES' ? Math.max(0, Number(formValues.partySize) || 0) : 0;

    try {
      const response = await fetch(RSVP_ENDPOINTS.update, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          token,
          attendance: formValues.attendance,
          partySize: parsedPartySize,
          additionalNames: formValues.otherGuestNames,
          notes: formValues.notes,
          email: formValues.email,
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || 'Unable to save your changes.');
      }

      setSaveState('success');
      setSaveMessage('Saved! Thank you for keeping us updated.');
      setRecord((prev) =>
        prev
          ? {
              ...prev,
              attendance: formValues.attendance,
              partySize: parsedPartySize,
              otherGuestNames: formValues.otherGuestNames,
              notes: formValues.notes,
              email: formValues.email,
              updatedAt: result.updatedAt ?? new Date().toISOString(),
            }
          : prev
      );
    } catch (error) {
      setSaveState('error');
      setSaveMessage(
        error instanceof Error
          ? error.message
          : 'We could not save your changes. Please try again.'
      );
    }
  };

  const renderStatusMessage = () => {
    if (loading) {
      return (
        <p
          className="font-sans"
          style={{
            fontSize: '1.125rem',
            color: theme.colors.text.secondary,
          }}
        >
          Loading your RSVP…
        </p>
      );
    }
    if (errorMessage && !record) {
      return (
        <div
          role="alert"
          style={{
            backgroundColor: '#FDECEA',
            border: '1px solid #F5C2C0',
            borderRadius: '12px',
            padding: '1rem',
            color: '#5f1a1a',
            fontSize: '1rem',
            marginTop: '1.5rem',
          }}
        >
          <p style={{ marginBottom: '0.75rem' }}>{errorMessage}</p>
          <p style={{ margin: 0 }}>
            If you need help, email{' '}
            <a href="mailto:daviiidle@gmail.com" style={{ textDecoration: 'underline' }}>
              daviiidle@gmail.com
            </a>
            .
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading || !record) {
    return (
      <section
        style={{
          minHeight: '70vh',
          padding: '3rem 1.5rem',
          backgroundColor: theme.colors.background.offWhite,
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>{renderStatusMessage()}</div>
      </section>
    );
  }

  return (
    <section
      style={{
        minHeight: '100vh',
        padding: '3rem 1.5rem',
        backgroundColor: theme.colors.background.offWhite,
      }}
    >
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1
          className="font-serif"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            marginBottom: '0.5rem',
            color: theme.colors.primary.dustyBlue,
          }}
        >
          View or edit your RSVP
        </h1>
        <p
          className="font-sans"
          style={{
            fontSize: '1.125rem',
            color: theme.colors.text.secondary,
            marginBottom: '1.5rem',
          }}
        >
          Hi {displayName}! Use the form below to update your household’s RSVP anytime.
        </p>

        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
          }}
        >
          <dl
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              rowGap: '0.75rem',
              margin: 0,
            }}
          >
            <div>
              <dt className="font-sans" style={{ fontWeight: 600, color: theme.colors.text.primary }}>
                Contact
              </dt>
              <dd style={{ margin: 0, color: theme.colors.text.secondary }}>
                {record.phone || record.phoneE164 || 'No phone on file'}
              </dd>
            </div>
            <div>
              <dt className="font-sans" style={{ fontWeight: 600, color: theme.colors.text.primary }}>
                Email
              </dt>
              <dd style={{ margin: 0, color: theme.colors.text.secondary }}>
                {record.email || 'None provided yet'}
              </dd>
            </div>
            {lastUpdatedLabel && (
              <div>
                <dt
                  className="font-sans"
                  style={{ fontWeight: 600, color: theme.colors.text.primary }}
                >
                  Last updated
                </dt>
                <dd style={{ margin: 0, color: theme.colors.text.secondary }}>{lastUpdatedLabel}</dd>
              </div>
            )}
          </dl>
        </div>

        <form onSubmit={handleSubmit}>
          <fieldset
            style={{
              border: 'none',
              padding: 0,
              margin: 0,
              marginBottom: '1.5rem',
            }}
          >
            <legend
              className="font-sans"
              style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem' }}
            >
              Attendance
            </legend>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {(['YES', 'NO'] as Array<'YES' | 'NO'>).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleAttendanceChange(option)}
                  style={{
                    flex: '1 0 120px',
                    padding: '0.75rem 1rem',
                    borderRadius: '9999px',
                    border:
                      formValues.attendance === option
                        ? `2px solid ${theme.colors.primary.dustyBlue}`
                        : '2px solid transparent',
                    backgroundColor:
                      formValues.attendance === option
                        ? '#fff'
                        : theme.colors.background.lightGray,
                    color:
                      formValues.attendance === option
                        ? theme.colors.primary.dustyBlue
                        : theme.colors.text.secondary,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {option === 'YES' ? 'Yes, we are coming' : 'No, we cannot attend'}
                </button>
              ))}
            </div>
          </fieldset>

          <label
            className="font-sans"
            style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}
          >
            Party size
            <input
              type="number"
              inputMode="numeric"
              min={0}
              disabled={formValues.attendance !== 'YES'}
              value={formValues.partySize}
              onChange={(event) => {
                const next = event.target.value.replace(/[^\d]/g, '');
                setFormValues((prev) => ({ ...prev, partySize: next || '0' }));
              }}
              style={{
                marginTop: '0.5rem',
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid #d0d5dd',
                fontSize: '1.125rem',
              }}
            />
          </label>

          <label className="font-sans" style={{ display: 'block', marginBottom: '1rem' }}>
            Additional guest names
            <textarea
              rows={3}
              value={formValues.otherGuestNames}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, otherGuestNames: event.target.value }))
              }
              placeholder="List everyone joining you"
              style={{
                marginTop: '0.5rem',
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid #d0d5dd',
                fontSize: '1rem',
              }}
            />
          </label>

          <label className="font-sans" style={{ display: 'block', marginBottom: '1rem' }}>
            Notes for the couple
            <textarea
              rows={4}
              value={formValues.notes}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, notes: event.target.value }))
              }
              placeholder="Allergies, song requests, anything else"
              style={{
                marginTop: '0.5rem',
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid #d0d5dd',
                fontSize: '1rem',
              }}
            />
          </label>

          <label className="font-sans" style={{ display: 'block', marginBottom: '1.5rem' }}>
            Email (optional)
            <input
              type="email"
              value={formValues.email}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, email: event.target.value }))
              }
              placeholder="Add an email so we can reach you"
              style={{
                marginTop: '0.5rem',
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid #d0d5dd',
                fontSize: '1rem',
              }}
            />
          </label>

          {saveMessage && (
            <div
              role="alert"
              style={{
                backgroundColor: saveState === 'success' ? '#ECFDF3' : '#FDECEA',
                border: `1px solid ${saveState === 'success' ? '#ABEFC6' : '#F5C2C0'}`,
                borderRadius: '12px',
                padding: '0.9rem 1rem',
                color: saveState === 'success' ? '#067647' : '#5f1a1a',
                marginBottom: '1rem',
              }}
            >
              {saveMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={saveState === 'saving'}
            style={{
              width: '100%',
              padding: '0.9rem 1rem',
              borderRadius: '9999px',
              backgroundColor: theme.colors.primary.dustyBlue,
              color: '#fff',
              fontSize: '1.125rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              opacity: saveState === 'saving' ? 0.7 : 1,
            }}
          >
            {saveState === 'saving' ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </section>
  );
}
