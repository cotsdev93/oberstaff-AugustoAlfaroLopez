import { useEffect, useMemo, useState, useCallback, useRef } from "react"
import Controls from "./components/Controls"
import ProfileGrid from "./components/ProfileGrid"
import ProfileModal from "./components/ProfileModal"
import { fetchRandomUsers, fetchOneRandomUser } from "./services/randomUser"
import "./scss/index.scss"

const lower = (s = "") => s.toLowerCase()
const tokens = (s = "") => lower(s).split(/[^a-z0-9áéíóúüñ]+/i).filter(Boolean)

const STORAGE_KEY = "usercards:v1"
const THEME_KEY = "usercards:theme"

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.profiles)) return null
    return parsed
  } catch {
    return null
  }
}
function saveToStorage(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === "dark" || saved === "light") return saved
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
  return prefersDark ? "dark" : "light"
}
function applyTheme(theme, withAnimation = false) {
  const root = document.documentElement
  if (withAnimation) {
    root.classList.add("theme-anim")
    window.setTimeout(() => root.classList.remove("theme-anim"), 350)
  }
  root.setAttribute("data-theme", theme)
  try { localStorage.setItem(THEME_KEY, theme) } catch {}
}

export default function App() {
  const [profiles, setProfiles] = useState([])
  const [loadingMode, setLoadingMode] = useState("initial")
  const [error, setError] = useState(null)
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("none")
  const [selected, setSelected] = useState(null)

  const [theme, setTheme] = useState(getInitialTheme())
  useEffect(() => { applyTheme(theme, false) }, [])

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    applyTheme(next, true)
  }

  const currentCtrl = useRef(null)
  const loadInitial = useCallback(async () => {
    const restored = loadFromStorage()
    if (restored && restored.profiles.length > 0) {
      setProfiles(restored.profiles)
      setQuery(restored.query ?? "")
      setSort(restored.sort ?? "none")
      setLoadingMode("idle")
      setError(null)
      return
    }
    const ctrl = new AbortController()
    currentCtrl.current = ctrl
    try {
      setLoadingMode("initial")
      setError(null)
      const data = await fetchRandomUsers(3, ctrl.signal)
      setProfiles(data)
    } catch (e) {
      if (e?.name !== "AbortError") setError("Error al cargar usuarios")
    } finally {
      setLoadingMode("idle")
      currentCtrl.current = null
    }
  }, [])

  useEffect(() => {
    loadInitial()
    return () => currentCtrl.current?.abort?.()
  }, [loadInitial])

  useEffect(() => {
    if (loadingMode === "initial") return
    saveToStorage({ profiles, query, sort })
  }, [profiles, query, sort, loadingMode])

  const handleAddOne = useCallback(async () => {
    if (loadingMode !== "idle") return
    const ctrl = new AbortController()
    currentCtrl.current = ctrl
    try {
      setLoadingMode("adding-one")
      setError(null)
      const u = await fetchOneRandomUser(ctrl.signal)
      setProfiles(prev => [u, ...prev])
    } catch (e) {
      if (e?.name !== "AbortError") setError("No se pudo generar un perfil")
    } finally {
      setLoadingMode("idle")
      currentCtrl.current = null
    }
  }, [loadingMode])

  const handleLoadMore = useCallback(async () => {
    if (loadingMode !== "idle") return
    const ctrl = new AbortController()
    currentCtrl.current = ctrl
    try {
      setLoadingMode("more")
      setError(null)
      const more = await fetchRandomUsers(3, ctrl.signal)
      setProfiles(prev => [...prev, ...more])
    } catch (e) {
      if (e?.name !== "AbortError") setError("No se pudo cargar más")
    } finally {
      setLoadingMode("idle")
      currentCtrl.current = null
    }
  }, [loadingMode])

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY)
    window.location.reload()
  }

  const derived = useMemo(() => {
    const q = lower(query).trim()
    const filtered = q
      ? profiles.filter(p => {
          const nt = tokens(p.fullName)
          const ct = tokens(p.country)
          return nt.some(t => t.startsWith(q)) || ct.some(t => t.startsWith(q))
        })
      : profiles

    if (sort === "none") return filtered
    const arr = [...filtered]
    const byName = (a, b) => lower(a.fullName).localeCompare(lower(b.fullName))
    const byCountry = (a, b) => lower(a.country).localeCompare(lower(b.country))
    switch (sort) {
      case "name-asc":  return arr.sort(byName)
      case "name-desc": return arr.sort((a, b) => byName(b, a))
      case "country-asc": return arr.sort(byCountry)
      default: return filtered
    }
  }, [profiles, query, sort])

  const emptyMessage =
    query.trim().length > 0
      ? `No se encontraron resultados para “${query}”`
      : "Sin usuarios por ahora"

  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__title">Usuarios</h1>
        <div className="page__actions">
          <button className="btn btn--ghost" onClick={toggleTheme}>
            {theme === "dark" ? "☀️ Claro" : "🌙 Oscuro"}
          </button>
          <button className="btn" onClick={handleAddOne} disabled={loadingMode !== "idle"}>
            {loadingMode === "adding-one" ? "Agregando…" : "Generar nuevo perfil"}
          </button>
          <button className="btn btn--muted" onClick={handleReset}>
            Reiniciar
          </button>
        </div>
      </header>

      <Controls query={query} sort={sort} onQuery={setQuery} onSort={setSort} />

      {error && <div className="banner banner--error">{error}</div>}

      <ProfileGrid
        profiles={derived}
        loadingMode={loadingMode}
        onLoadMore={handleLoadMore}
        onSelect={setSelected}
        emptyMessage={emptyMessage}
        onRetryLoadMore={handleLoadMore}
      />

      {selected && <ProfileModal profile={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}
