"use server";

interface Device {
  id: number;
  name: string;
  status: string;
  telemetry: any;
}

export default async function fetchClient(id: string) {
  try {
    const res = await fetch(`http://localhost:8080/assets/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch device");
    }
    const data = await res.json();
    return data as Device;
  } catch (err) {
    console.log(err);
  }
}
