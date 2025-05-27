// lib/api.ts
export async function fetchShipments(token: string) {
  const res = await fetch("https://www.hungryblogs.com/api/GetShipments", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch shipments")
  }

  const data = await res.json()
  return data.details || []
}
