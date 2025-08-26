// src/services/randomUser.js
const BASE = "https://randomuser.me/api/";
const FIELDS = ["name", "location", "email", "phone", "picture", "login"].join(",");

function mapUser(u) {
  const first = u?.name?.first ?? "";
  const last = u?.name?.last ?? "";
  return {
    id: u?.login?.uuid ?? crypto.randomUUID(),
    fullName: `${first} ${last}`.trim(),
    country: u?.location?.country ?? "",
    city: u?.location?.city ?? "",
    email: u?.email ?? "",
    phone: u?.phone ?? "",
    picture: u?.picture?.large ?? u?.picture?.medium ?? "",
  };
}

export async function fetchRandomUsers(count = 3, signal) {
  const url = `${BASE}?results=${count}&inc=${FIELDS}&noinfo&nat=us,gb,fr,es,br,au,ca`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return (data.results || []).map(mapUser);
}
