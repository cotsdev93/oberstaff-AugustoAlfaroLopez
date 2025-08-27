// src/services/randomUser.js
const BASE = "https://randomuser.me/api/";
const FIELDS = ["name", "location", "email", "phone", "picture", "login", "dob"].join(",");

function mapUser(u) {
  const first = u?.name?.first ?? "";
  const last  = u?.name?.last ?? "";

  const streetNum  = u?.location?.street?.number ?? "";
  const streetName = u?.location?.street?.name ?? "";
  const city    = u?.location?.city ?? "";
  const state   = u?.location?.state ?? "";
  const country = u?.location?.country ?? "";
  const post    = (u?.location?.postcode ?? "").toString();

  const tzOffset = u?.location?.timezone?.offset ?? "";
  const tzDesc   = u?.location?.timezone?.description ?? "";

  const dobISO = u?.dob?.date ?? null;
  const dob    = dobISO ? new Date(dobISO) : null;
  const dobDisplay = dob ? dob.toLocaleDateString(undefined, { year:"numeric", month:"long", day:"numeric" }) : "";
  const age    = u?.dob?.age ?? null;

  return {
    id: u?.login?.uuid ?? crypto.randomUUID(),
    fullName: `${first} ${last}`.trim(),
    country,
    city,
    state,
    postcode: post,
    streetLine: streetNum && streetName ? `${streetNum} ${streetName}` : (streetName || ""),
    addressFull: [
      streetNum && streetName ? `${streetNum} ${streetName}` : (streetName || ""),
      city,
      state ? `${state} ${post}` : post,
      country
    ].filter(Boolean).join(", "),
    email: u?.email ?? "",
    phone: u?.phone ?? "",
    picture: u?.picture?.large ?? u?.picture?.medium ?? "",
    createdAt: Date.now(), // para “recientes”, si lo necesitás
    // detalle extra
    dobISO,
    dobDisplay,
    age,
    timezone: { offset: tzOffset, description: tzDesc },
  };
}

export async function fetchRandomUsers(count = 3, signal) {
  const url = `${BASE}?results=${count}&inc=${FIELDS}&noinfo&nat=us,gb,fr,es,br,au,ca`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return (data.results || []).map(mapUser);
}

export async function fetchOneRandomUser(signal) {
  const arr = await fetchRandomUsers(1, signal);
  return arr[0];
}
