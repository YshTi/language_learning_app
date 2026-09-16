import FilterSelect from "../filter-select/FilterSelect";
import ButtonLink from "../buttons/Button";

import styles from "./Filters.module.css";

interface Option {
  label: string;
  value: string;
}

interface FiltersProps {
  language: string;
  level: string;
  price: string;

  languageOptions: Option[];
  levelOptions: Option[];

  onLanguageChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onPriceChange: (value: string) => void;

  hasActiveFilters: boolean;
  onReset: () => void;
}

const priceOptions = [
  { label: "10 $", value: "10" },
  { label: "20 $", value: "20" },
  { label: "30 $", value: "30" },
  { label: "40 $", value: "40" },
];

const Filters = ({
  language,
  level,
  price,
  languageOptions,
  levelOptions,
  onLanguageChange,
  onLevelChange,
  onPriceChange,
  hasActiveFilters,
  onReset,
}: FiltersProps) => {
  return (
    <div className={styles.filters}>
      <FilterSelect
        label="Languages"
        value={language}
        options={languageOptions}
        onChange={onLanguageChange}
        placeholder="All languages"
        className={styles.language}
      />

      <FilterSelect
        label="Level of knowledge"
        value={level}
        options={levelOptions}
        onChange={onLevelChange}
        placeholder="All levels"
        className={styles.level}
      />

      <FilterSelect
        label="Price"
        value={price}
        options={priceOptions}
        onChange={onPriceChange}
        placeholder="All prices"
        className={styles.price}
      />

      {hasActiveFilters && (
        <ButtonLink
          as="button"
          variant="secondary"
          onClick={onReset}
          className={styles.resetButton}
        >
          Reset filters
        </ButtonLink>
      )}
    </div>
  );
};

export default Filters;
