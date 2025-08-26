import { useEffect, useState } from "react";
import ProfileGrid from "./components/ProfileGrid";
import { fetchRandomUsers } from "./services/randomUser";

export default function App() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState("initial");
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading("initial");
        setError(null);
        const data = await fetchRandomUsers(3, ctrl.signal);
        setProfiles(data);
        setLoading("idle");
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e.message || "Error al cargar usuarios");
          setLoading("idle");
        }
      }
    })();
    return () => ctrl.abort();
  }, []);

  if (loading === "initial") return <main className="page">Cargando…</main>;
  if (error) return <main className="page">Error: {error}</main>;

  return (
    <main className="page">
      <h1 className="page__title">Usuarios</h1>
      <ProfileGrid profiles={profiles} />
    </main>
  );
}
