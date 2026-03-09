import { useState, useRef, useEffect, useId } from 'react';
import '../styles/Combobox.css';

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  id?: string;
  label: string;
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function Combobox({
  id: providedId,
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
}: ComboboxProps) {
  const generatedId = useId();
  const id = providedId || generatedId;
  const listboxId = `${id}-listbox`;
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update display value when value prop changes
  useEffect(() => {
    const selected = options.find((opt) => opt.value === value);
    setDisplayValue(selected?.label || '');
  }, [value, options]);

  // Filter options based on search
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeListbox();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Scroll active option into view
  useEffect(() => {
    if (activeIndex >= 0 && listboxRef.current) {
      const activeOption = listboxRef.current.children[activeIndex] as HTMLElement;
      if (activeOption) {
        activeOption.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  const openListbox = () => {
    if (!disabled) {
      setIsOpen(true);
      setActiveIndex(-1);
    }
  };

  const closeListbox = () => {
    setIsOpen(false);
    setActiveIndex(-1);
    setSearchValue('');
    // Restore display value when closing without selection
    const selected = options.find((opt) => opt.value === value);
    setDisplayValue(selected?.label || '');
  };

  const selectOption = (option: ComboboxOption) => {
    onChange(option.value);
    setDisplayValue(option.label);
    setSearchValue('');
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    setDisplayValue(newValue);
    setActiveIndex(-1);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputClick = () => {
    if (isOpen) {
      closeListbox();
    } else {
      openListbox();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          openListbox();
        } else if (activeIndex < filteredOptions.length - 1) {
          setActiveIndex(activeIndex + 1);
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (activeIndex > 0) {
          setActiveIndex(activeIndex - 1);
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (isOpen && activeIndex >= 0) {
          selectOption(filteredOptions[activeIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        closeListbox();
        break;

      case 'Tab':
        if (isOpen) {
          closeListbox();
        }
        break;

      default:
        if (!isOpen) {
          openListbox();
        }
        break;
    }
  };

  const handleOptionClick = (option: ComboboxOption) => {
    selectOption(option);
  };

  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setDisplayValue('');
    setSearchValue('');
    inputRef.current?.focus();
  };

  return (
    <div className="combobox-container" ref={containerRef}>
      <label htmlFor={id} className="combobox-label">
        {label}
        {required && <span className="required-indicator"> *</span>}
      </label>
      <div className="combobox-wrapper">
        <input
          ref={inputRef}
          id={id}
          type="text"
          className="combobox-input"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={
            activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
          }
          value={displayValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          required={required}
        />
        <div className="combobox-buttons">
          {value && !disabled && (
            <button
              type="button"
              className="combobox-clear"
              onClick={handleClearClick}
              aria-label="Clear selection"
              tabIndex={-1}
            >
              ×
            </button>
          )}
          <button
            type="button"
            className="combobox-toggle"
            onClick={handleInputClick}
            aria-label="Toggle options"
            tabIndex={-1}
            disabled={disabled}
          >
            {isOpen ? '^' : 'v'}
          </button>
        </div>
      </div>
      {isOpen && (
        <ul
          ref={listboxRef}
          id={listboxId}
          className="combobox-listbox"
          role="listbox"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={option.value === value}
                className={`combobox-option ${
                  index === activeIndex ? 'active' : ''
                } ${option.value === value ? 'selected' : ''}`}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="combobox-option no-results">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
}
