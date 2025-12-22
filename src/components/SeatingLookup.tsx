import { useState, useRef, useEffect } from 'react';
import { theme } from '../theme';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLanguage } from '../context/LanguageContext';

interface Guest {
  name: string;
  table: number;
}

interface SeatingData {
  guests: Guest[];
}

export function SeatingLookup() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, { duration: 0.6 });
  const { strings, formatMessage } = useLanguage();
  const seatingText = strings.seating;

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
    <section
      id="seating"
      ref={sectionRef}
      aria-labelledby="seating-heading"
      style={{
        backgroundColor: theme.colors.background.white,
        padding: `${theme.spacing['4xl']} ${theme.spacing.lg}`,
      }}
    >
      <div
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {/* Heading */}
        <h2
          id="seating-heading"
          className="font-serif"
          style={{
            fontFamily: theme.typography.fontFamily.serif,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary.dustyBlue,
            marginBottom: theme.spacing.lg,
          }}
        >
          {seatingText.heading}
        </h2>

        {/* Subtitle */}
        <p
          className="font-sans"
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.base,
            fontWeight: theme.typography.fontWeight.normal,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing['2xl'],
          }}
        >
          {seatingText.subtitle}
        </p>

        {/* Search Input Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <div style={{ position: 'relative' }}>
            {/* Input Field */}
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
              style={{
                fontFamily: theme.typography.fontFamily.sans,
                fontSize: theme.typography.fontSize.base,
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                border: `2px solid ${theme.colors.primary.dustyBlue}40`,
                borderRadius: theme.borderRadius.lg,
                outline: 'none',
                transition: theme.transitions.base,
                backgroundColor: theme.colors.background.white,
                color: theme.colors.text.primary,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary.dustyBlue;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.colors.primary.dustyBlue}20`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = `${theme.colors.primary.dustyBlue}40`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            />

            {/* Suggestions Dropdown */}
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

          {/* Search Button */}
          <button
            onClick={() => handleSearch()}
            disabled={isLoading}
            className={!isLoading ? 'btn-hover' : ''}
            style={{
              fontFamily: theme.typography.fontFamily.sans,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.semibold,
              padding: `${theme.spacing.md} ${theme.spacing['2xl']}`,
              minHeight: '48px',
              backgroundColor: theme.colors.primary.dustyBlue,
              color: theme.colors.text.inverse,
              border: 'none',
              borderRadius: theme.borderRadius.lg,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              boxShadow: theme.shadows.md,
              opacity: isLoading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = theme.colors.primary.dustyBlueDark;
                e.currentTarget.style.boxShadow = theme.shadows.lg;
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = theme.colors.primary.dustyBlue;
                e.currentTarget.style.boxShadow = theme.shadows.md;
              }
            }}
          >
            {isLoading ? seatingText.searchingButton : seatingText.searchButton}
          </button>
        </div>

        {/* Result Display */}
        {result && (
          <div
            style={{
              padding: theme.spacing.xl,
              borderRadius: theme.borderRadius.xl,
              backgroundColor: result.found
                ? `${theme.colors.primary.dustyBlue}15`
                : `${theme.colors.secondary.slate}15`,
              border: `2px solid ${result.found
                ? theme.colors.primary.dustyBlue
                : theme.colors.secondary.slate}40`,
              marginBottom: theme.spacing.lg,
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

            {/* Not Found Hint */}
            {!result.found && (
              <p
                className="font-sans"
                style={{
                  fontFamily: theme.typography.fontFamily.sans,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.normal,
                  color: theme.colors.text.secondary,
                  fontStyle: 'italic',
                }}
              >
                {seatingText.notFoundHint}
              </p>
            )}
          </div>
        )}

        {/* Hint Text */}
        <p
          className="font-sans"
          style={{
            fontFamily: theme.typography.fontFamily.sans,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.normal,
            color: theme.colors.text.muted,
            fontStyle: 'italic',
          }}
        >
          {seatingText.hint}
        </p>
      </div>
    </section>
  );
}
