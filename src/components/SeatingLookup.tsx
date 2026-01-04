import { useState, useRef, useEffect, useCallback } from 'react';
import { theme } from '../theme';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLanguage } from '../context/useLanguage';
import { Section } from './Section';

interface Guest {
  name: string;
  table: number;
}

interface SeatingData {
  guests: Guest[];
}

export function SeatingLookup() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const activateTitleAnimation = useCallback(() => {
    headingRef.current?.classList.add('page-title-handwriting--active');
  }, []);
  useScrollReveal(sectionRef, { duration: 0.6, onEnter: activateTitleAnimation });
  const { strings, formatMessage } = useLanguage();
  const seatingText = strings.seating;
  const formWrapperStyle = {
    maxWidth: '680px',
    width: '100%',
    margin: '0 auto',
    textAlign: 'center' as const,
  };
  const inputStyle = {
    fontFamily: theme.typography.fontFamily.sans,
    fontSize: theme.typography.fontSize.base,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    border: `1px solid ${theme.colors.primary.dustyBlue}40`,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.white,
    color: theme.colors.text.primary,
    minHeight: '52px',
    width: '100%',
    transition: theme.transitions.base,
  };
  const primaryButtonStyle = {
    fontFamily: theme.typography.fontFamily.sans,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    padding: `${theme.spacing.sm} ${theme.spacing['2xl']}`,
    borderRadius: theme.borderRadius.full,
    border: 'none',
    backgroundColor: theme.colors.primary.dustyBlue,
    color: theme.colors.text.inverse,
    cursor: 'pointer',
    minHeight: '48px',
    boxShadow: theme.shadows.md,
    transition: theme.transitions.base,
  };

  const [searchName, setSearchName] = useState('');
  const [result, setResult] = useState<{ found: boolean; table?: number; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [suggestions, setSuggestions] = useState<Guest[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch guest data on mount
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}seating.json`);
        if (response.ok) {
          const data: SeatingData = await response.json();
          setAllGuests(data.guests);
        }
      } catch (error) {
        console.error('Failed to load guest data:', error);
      }
    };
    fetchGuests();
  }, []);

  // Normalize name: trim, lowercase, collapse multiple spaces
  const normalizeName = (name: string): string => {
    return name.trim().toLowerCase().replace(/\s+/g, ' ');
  };

  // Update suggestions as user types
  useEffect(() => {
    if (searchName.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      return;
    }

    const normalizedSearch = normalizeName(searchName);
    const filtered = allGuests.filter((guest) =>
      normalizeName(guest.name).includes(normalizedSearch)
    ).slice(0, 8); // Limit to 8 suggestions

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedSuggestionIndex(-1);
  }, [searchName, allGuests]);

  const handleSearch = async (guestName?: string) => {
    const nameToSearch = guestName || searchName;

    if (!nameToSearch.trim()) {
      setResult({
        found: false,
        message: seatingText.enterNamePrompt
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setShowSuggestions(false);

    try {
      const normalizedSearch = normalizeName(nameToSearch);

      // Find guest by normalized name from cached data
      const guest = allGuests.find(
        (g) => normalizeName(g.name) === normalizedSearch
      );

      if (guest) {
        setResult({
          found: true,
          table: guest.table,
          message: formatMessage(seatingText.resultFound, { table: guest.table })
        });
      } else {
        setResult({
          found: false,
          message: seatingText.resultNotFound
        });
      }
    } catch (error) {
      setResult({
        found: false,
        message: seatingText.error
      });
      console.error('Seating lookup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (guest: Guest) => {
    setSearchName(guest.name);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    handleSearch(guest.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSelectSuggestion(suggestions[selectedSuggestionIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Section
      id="seating"
      ref={sectionRef}
      aria-labelledby="seating-heading"
      className="page-seating"
      style={{
        backgroundColor: theme.colors.background.white,
      }}
      maxWidth={theme.layout.maxWidth}
      innerStyle={{ textAlign: 'center' }}
    >
        <p
          className="font-sans veil-text"
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.sm,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: theme.colors.secondary.slate,
            marginBottom: theme.spacing.xs,
          }}
        >
          {strings.navigation.seating}
        </p>

        {/* Heading */}
        <h2
          id="seating-heading"
          ref={headingRef}
          className="font-serif page-title-handwriting"
          style={{
            fontFamily: '"Mea Culpa", "Playfair Display", serif',
            fontSize: theme.typography.heading.h2,
            fontWeight: 400,
            color: theme.colors.primary.dustyBlue,
            letterSpacing: '0.05em',
            marginBottom: theme.spacing.md,
          }}
        >
          <span className="hero-handwriting veil-text">
            <span className="hero-handwriting__text">{seatingText.heading}</span>
          </span>
        </h2>

        {/* Subtitle */}
        <p
          className="font-sans"
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.lg,
            lineHeight: theme.typography.lineHeight.relaxed,
            color: theme.colors.text.secondary,
            maxWidth: '720px',
            margin: `0 auto ${theme.spacing['3xl']}`,
          }}
        >
          {seatingText.subtitle}
        </p>

        <div style={formWrapperStyle}>
          <p
            className="font-sans"
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.sm,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: theme.colors.secondary.slate,
              textAlign: 'center',
              marginBottom: theme.spacing.lg,
            }}
          >
            {seatingText.enterNamePrompt}
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.lg,
              marginBottom: theme.spacing.xl,
            }}
          >
            <div style={{ position: 'relative' }}>
              <input
                ref={inputRef}
                type="text"
                placeholder={seatingText.inputPlaceholder}
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={showSuggestions}
                aria-controls="suggestions-list"
                className="seating-input"
                style={inputStyle}
              />

              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  id="suggestions-list"
                  role="listbox"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    backgroundColor: theme.colors.background.white,
                    border: `2px solid ${theme.colors.primary.dustyBlue}`,
                    borderRadius: theme.borderRadius.lg,
                    boxShadow: theme.shadows.xl,
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 5,
                  }}
                >
                  {suggestions.map((guest, index) => (
                    <div
                      key={`${guest.name}-${guest.table}`}
                      role="option"
                      aria-selected={selectedSuggestionIndex === index}
                      onClick={() => handleSelectSuggestion(guest)}
                      onMouseEnter={() => setSelectedSuggestionIndex(index)}
                      style={{
                        fontFamily: theme.typography.fontFamily.sans,
                        fontSize: theme.typography.fontSize.base,
                        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                        cursor: 'pointer',
                        backgroundColor:
                          selectedSuggestionIndex === index
                            ? `${theme.colors.primary.dustyBlue}20`
                            : theme.colors.background.white,
                        color: theme.colors.text.primary,
                        borderBottom:
                          index < suggestions.length - 1
                            ? `1px solid ${theme.colors.primary.dustyBlue}20`
                            : 'none',
                        transition: theme.transitions.fast,
                      }}
                    >
                      <div style={{ fontWeight: theme.typography.fontWeight.medium }}>
                        {guest.name}
                      </div>
                      <div
                        style={{
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.text.secondary,
                          marginTop: '2px',
                        }}
                      >
                        {formatMessage(seatingText.tableLabel, { table: guest.table })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleSearch()}
              disabled={isLoading}
              className="form-primary-button"
              style={{
                ...primaryButtonStyle,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? seatingText.searchingButton : seatingText.searchButton}
            </button>
          </div>

          {result && (
            <div
              style={{
                padding: theme.spacing.xl,
                borderRadius: theme.borderRadius['2xl'],
                backgroundColor: result.found
                  ? `${theme.colors.primary.dustyBlue}12`
                  : `${theme.colors.secondary.slate}12`,
                border: result.found
                  ? `1px solid ${theme.colors.primary.dustyBlue}50`
                  : `1px solid ${theme.colors.secondary.slate}50`,
                textAlign: 'center',
                marginTop: theme.spacing.lg,
              }}
            >
              <p
                className="font-serif"
                style={{
                  fontFamily: theme.typography.fontFamily.serif,
                  fontSize: theme.typography.fontSize['2xl'],
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: result.found
                    ? theme.colors.primary.dustyBlue
                    : theme.colors.text.primary,
                  marginBottom: result.found ? 0 : theme.spacing.sm,
                }}
              >
                {result.message}
              </p>

              {!result.found && (
                <p
                  className="font-sans"
                  style={{
                    fontFamily: theme.typography.fontFamily.sans,
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary,
                    fontStyle: 'italic',
                  }}
                >
                  {seatingText.notFoundHint}
                </p>
              )}
            </div>
          )}
        </div>

        <p
          className="font-sans"
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.secondary.slate,
            opacity: 0.8,
            fontStyle: 'italic',
            marginTop: theme.spacing['2xl'],
            textAlign: 'center',
          }}
        >
          {seatingText.hint}
        </p>
    </Section>
  );
}
