export default function ProfileCard({ p }) {
  return (
    <article className="card">
      <img className="card__avatar" src={p.picture} alt={`Foto de ${p.fullName}`} />
      <h3 className="card__name">{p.fullName}</h3>
      <p className="card__meta">{p.city}, {p.country}</p>
      <p className="card__contact">{p.email}</p>
      <p className="card__contact">{p.phone}</p>
    </article>
  );
}
