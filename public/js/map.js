document.addEventListener("DOMContentLoaded", async () => {
  const mapToken = window.mapToken;
  const locationText = window.locationText;

  if (!mapToken || !locationText) {cl
    console.error("Map token or location missing");
    return;
  }

  // 🔹 Geocoding request
  const response = await fetch(
    `https://api.maptiler.com/geocoding/${encodeURIComponent(
      locationText
    )}.json?key=${mapToken}`
  );

  const data = await response.json();

  if (!data.features || data.features.length === 0) {
    console.error("Location not found");
    return;
  }

  const [longitude, latitude] = data.features[0].center;

  const map = L.map("map", {
    center: [latitude, longitude],
    zoom: 10,
    scrollWheelZoom: false,
  });

  L.tileLayer(
    `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${mapToken}`,
    {
      attribution: "© MapTiler © OpenStreetMap contributors",
      tileSize: 512,
      zoomOffset: -1,
    }
  ).addTo(map);

  L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup(`<b>${locationText}</b>`)
    .openPopup();
});
