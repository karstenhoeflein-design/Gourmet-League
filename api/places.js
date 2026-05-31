export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");

  const { type, q, lat, lon } = req.query;

  try {
    if (type === "search") {
      const url = "https://nominatim.openstreetmap.org/search?" + new URLSearchParams({
        q, format: "json", limit: "20", countrycodes: "de", addressdetails: "1",
      });
      const r = await fetch(url, {
        headers: { "User-Agent": "GourmetLeague/1.0 (gourmet-league-v2.vercel.app)" },
      });
      const data = await r.json();
      return res.status(200).json(data);
    }

    if (type === "nearby") {
      const query = `[out:json][timeout:20];node["amenity"="restaurant"](around:3000,${lat},${lon});out tags 30;`;
      const r = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: "data=" + encodeURIComponent(query),
      });
      const data = await r.json();
      return res.status(200).json(data);
    }

    res.status(400).json({ error: "Invalid type" });
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
}
