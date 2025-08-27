import { useMemo } from "react";

const OPTIONS = [
  { value: "none",        label: "Por defecto" },
  { value: "country-asc", label: "País A–Z" },
  { value: "name-asc",    label: "Nombre A–Z" },
  { value: "name-desc",   label: "Nombre Z–A" },
];

export default function Controls({ query, sort, onQuery, onSort }) {
  const activeIndex = useMemo(
    () => Math.max(0, OPTIONS.findIndex((o) => o.value === sort)),
    [sort]
  );

  return (
    <header className="controls">
      <input
        className="controls__search"
        type="search"
        placeholder="Buscar por nombre o país…"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        aria-label="Buscar perfiles"
      />

      <div
        className="seg"
        role="radiogroup"
        aria-label="Ordenar perfiles"
        style={{ "--seg-index": activeIndex }}
      >
        <div className="seg__thumb" aria-hidden="true" />
        {OPTIONS.map((opt) => (
          <label key={opt.value} className="seg__item">
            <input
              className="seg__radio"
              type="radio"
              name="sort"
              value={opt.value}
              checked={sort === opt.value}
              onChange={(e) => onSort(e.target.value)}
              aria-checked={sort === opt.value}
              aria-label={opt.label}
            />
            <span className="seg__label">{opt.label}</span>
          </label>
        ))}
      </div>
    </header>
  );
}
