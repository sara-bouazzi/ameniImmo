const API_BASE = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

export async function getAnnonces() {
  const url = `${API_BASE}/api/annonces/`;
  const token = localStorage.getItem("access_token") || null;
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const resp = await fetch(url, { headers });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`API error ${resp.status}: ${txt}`);
  }
  const data = await resp.json();
  return data;
}

const annonceService = { getAnnonces };
export default annonceService;
