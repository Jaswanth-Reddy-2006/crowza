import React, { useState, useEffect } from 'react';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  mask: string;
  regex: RegExp;
}

const COUNTRIES: Country[] = [
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91', mask: 'XXXXX XXXXX', regex: /^[6-9]\d{9}$/ },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', mask: '(XXX) XXX-XXXX', regex: /^\d{10}$/ },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', mask: 'XXXX XXXXXX', regex: /^\d{10}$/ },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', dialCode: '+971', mask: 'X XXX XXXX', regex: /^\d{8,9}$/ },
];

interface PhoneInputProps {
  value: string;
  onChange: (phoneNumber: string) => void;
  placeholder?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, placeholder }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Sync internal state with external value if needed
  useEffect(() => {
    if (value && !inputValue) {
      const country = COUNTRIES.find(c => value.startsWith(c.dialCode)) || COUNTRIES[0];
      setSelectedCountry(country);
      setInputValue(value.replace(country.dialCode, ''));
    }
  }, [value]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    setInputValue(digits);
    onChange(selectedCountry.dialCode + digits);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    onChange(country.dialCode + inputValue);
  };

  const isValid = selectedCountry.regex.test(inputValue);
  const showValidation = inputValue.length > 0;

  return (
    <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
      <label style={{
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: '700',
        color: 'var(--text-secondary)',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        Phone Number
      </label>
      
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        backgroundColor: 'white',
        border: `2px solid ${isFocused ? 'var(--color-primary)' : 'var(--border-color)'}`,
        borderRadius: '16px',
        height: '52px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isFocused ? '0 0 0 4px var(--color-primary-glow)' : 'none',
        overflow: 'visible'
      }}>
        {/* Country Selector */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0 1rem',
              background: 'var(--bg-secondary)',
              border: 'none',
              borderRight: '1px solid var(--border-color)',
              borderRadius: '14px 0 0 14px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '1rem',
              color: 'var(--text-primary)'
            }}
          >
            <span>{selectedCountry.flag}</span>
            <span>{selectedCountry.dialCode}</span>
            <ChevronDown size={14} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
          </button>

          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              width: '240px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)',
              zIndex: 100,
              padding: '0.5rem',
              animation: 'slideInUp 0.2s ease-out'
            }}>
              {COUNTRIES.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleCountrySelect(c)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: selectedCountry.code === c.code ? 'var(--color-primary-light)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { if (selectedCountry.code !== c.code) e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}
                  onMouseLeave={(e) => { if (selectedCountry.code !== c.code) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span>{c.flag}</span>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{c.name}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: '700' }}>{c.dialCode}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <input
          type="tel"
          value={inputValue}
          onChange={handlePhoneChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder || `Example: ${selectedCountry.code === 'IN' ? '98765 43210' : '555 123 4567'}`}
          style={{
            flex: 1,
            padding: '0 1.25rem',
            border: 'none',
            outline: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            backgroundColor: 'transparent',
            color: 'var(--text-primary)'
          }}
        />

        {/* Validation Icon */}
        {showValidation && (
          <div style={{ display: 'flex', alignItems: 'center', paddingRight: '1rem' }}>
            {isValid ? (
              <Check size={20} color="var(--color-success)" />
            ) : (
              <AlertCircle size={20} color="var(--color-error)" />
            )}
          </div>
        )}
      </div>

      {/* Validation Message */}
      {showValidation && !isValid && (
        <p style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: '1rem',
          fontSize: '0.75rem',
          color: 'var(--color-error)',
          fontWeight: '600',
          margin: 0
        }}>
          Please enter a valid {selectedCountry.name} phone number
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
