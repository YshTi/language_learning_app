import { useEffect, useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";

import styles from "./FilterSelect.module.css";

interface Option {
  label: string;
  value: string;
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const FilterSelect = ({
  label,
  value,
  options,
  onChange,
  className = "",
  placeholder = "Select",
}: FilterSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`${styles.wrapper} ${className}`}>
      <p className={styles.label}>{label}</p>

      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        disabled={options.length === 0}
      >
        <span>{selectedOption?.label ?? placeholder}</span>

        <IoChevronDown
          className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`}
        />
      </button>

      {isOpen && options.length > 0 && (
        <ul className={`${styles.menu} ${isOpen ? styles.menuOpen : ""}`}>
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value}>
                <button
                  type="button"
                  className={
                    isSelected
                      ? `${styles.option} ${styles.selected}`
                      : styles.option
                  }
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FilterSelect;
