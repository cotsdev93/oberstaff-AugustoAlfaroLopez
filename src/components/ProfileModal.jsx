import { useEffect, useRef, useState } from "react";

export default function ProfileModal({ profile, onClose }) {
  const dialogRef = useRef(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") requestClose(); };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => dialogRef.current?.focus(), 0);
    return () => { document.removeEventListener("keydown", onKey); clearTimeout(t); };
  }, []);

  if (!profile) return null;

  const requestClose = () => {
    setClosing(true);
    setTimeout(() => onClose?.(), 220);
  };

  return (
    <div className={`modal ${closing ? "is-closing" : "is-opening"}`} role="dialog" aria-modal="true" aria-label={`Detalle de ${profile.fullName}`}>
      <div className="modal__backdrop" onClick={requestClose} />
      <div className="modal__content" role="document" ref={dialogRef} tabIndex={-1}>
        <button className="modal__close" onClick={requestClose} aria-label="Cerrar">✕</button>

        <div className="modal__header">
          <img className="modal__avatar" src={profile.picture} alt={`Foto de ${profile.fullName}`} />
          <div>
            <h2 className="modal__title">{profile.fullName}</h2>
            <p className="modal__subtitle">{profile.city}, {profile.country}</p>
          </div>
        </div>

        <div className="modal__body">
          <div className="detail">
            <span className="detail__label">Email</span>
            <a className="detail__value" href={`mailto:${profile.email}`}>{profile.email}</a>
          </div>

          <div className="detail">
            <span className="detail__label">Teléfono</span>
            <a className="detail__value" href={`tel:${profile.phone}`}>{profile.phone}</a>
          </div>

          <div className="detail">
            <span className="detail__label">Dirección</span>
            <span className="detail__value">{profile.addressFull}</span>
          </div>

          <div className="detail">
            <span className="detail__label">Nacimiento</span>
            <span className="detail__value">
              {profile.dobDisplay}{profile.age ? ` (${profile.age} años)` : ""}
            </span>
          </div>

          <div className="detail">
            <span className="detail__label">Zona horaria</span>
            <span className="detail__value">
              {profile.timezone?.offset ? `UTC${profile.timezone.offset}` : ""}
              {profile.timezone?.description ? ` — ${profile.timezone.description}` : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
