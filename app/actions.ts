"use server";

export default async function fetchClient(id: string) {
  try {
    const res = await fetch(`http://localhost:8080/assets/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch device");
    }
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}
