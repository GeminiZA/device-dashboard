"use server";

import { Device, TelemetryData, TelemetryEntry } from "./types";

export async function fetchDevices() {
  try {
    const res = await fetch(`http://localhost:8080/assets`);
    if (!res.ok) {
      throw new Error("Failed to fetch device");
    }
    const data = await res.json();
    const devices = data.devices;
    if (!devices) {
      return [];
    }
    console.log("data:", data);
    console.log("Devices:", devices);
    const formattedDevices = devices.map((device: any) => {
      return {
        id: device.id,
        name: device.name,
        status: device.status,
        telemetry: [],
      } as Device;
    });
    console.log(formattedDevices);
    return formattedDevices;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchDeviceTelemetry(id: number) {
  try {
    const res = await fetch(`http://localhost:8080/assets/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch device");
    }
    const data = await res.json();
    console.log("Telemetry data:", data);
    if (data.telemetry) {
      console.log("Telemetry data.telemetry:", data.telemetry);
      const telemetry = data.telemetry as TelemetryEntry[];
      return telemetry;
    }
    return null;
  } catch (err) {
    console.log(err);
  }
}
