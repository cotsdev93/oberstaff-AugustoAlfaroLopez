import ProfileCard from "./ProfileCard";

export default function ProfileGrid({ profiles = [] }) {
  return (
    <section className="grid">
      {profiles.map((p) => <ProfileCard key={p.id} p={p} />)}
    </section>
  );
}