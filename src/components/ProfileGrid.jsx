import { memo } from "react";

function Card({ p, onSelect, index }) {
  return (
    <article
      className="card"
      data-idx={index}
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(p)}
      onKeyDown={(e) => e.key === "Enter" && onSelect?.(p)}
      aria-label={`Ver detalles de ${p.fullName}`}
      title="Ver detalles"
    >
      <img className="card__avatar" src={p.picture} alt={`Foto de ${p.fullName}`} />
      <h3 className="card__name">{p.fullName}</h3>
      <p className="card__meta">{p.city}, {p.country}</p>
      <p className="card__contact">{p.email}</p>
      <p className="card__contact">{p.phone}</p>
    </article>
  );
}

function SkeletonCard({ index }) {
  return (
    <article className="card card--skeleton" data-idx={index} aria-hidden="true">
      <div className="sk sk__avatar" />
      <div className="sk sk__line sk__line--lg" />
      <div className="sk sk__line" />
      <div className="sk sk__line" />
    </article>
  );
}

export default memo(function ProfileGrid({
  profiles,
  loadingMode,
  onLoadMore,
  onSelect,
  emptyMessage = "Sin usuarios por ahora.",
}) {
  if (loadingMode === "initial") {
    return (
      <section className="grid" aria-busy="true" aria-live="polite" role="status">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
      </section>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div className="empty" role="status" aria-live="polite">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const isLoadingMore = loadingMode === "more";

  return (
    <>
      <section className="grid" aria-live="polite">
        {profiles.map((p, idx) => (
          <Card key={p.id} p={p} index={idx} onSelect={onSelect} />
        ))}
      </section>

      <div className="grid__actions" role="status" aria-live="polite">
        <button
          className={`btn ${isLoadingMore ? "btn--loading" : ""}`}
          onClick={() => onLoadMore && onLoadMore()}
          disabled={isLoadingMore || loadingMode !== "idle"}
        >
          {isLoadingMore ? (
            <>
              <span className="btn__spinner spinner spinner--sm" aria-hidden="true" />
              Cargando…
            </>
          ) : (
            "Cargar más"
          )}
        </button>
      </div>
    </>
  );
});
