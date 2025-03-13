"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";
import { fetchDevices, fetchDeviceTelemetry } from "./actions";

import { Device, TelemetryData } from "./types";
import TelemetryGraph from "./graph";
import { time } from "console";

export default function Home() {
  const [devices, setDevices] = useState<Device[]>([]);
  const clientOpts = {
    username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
    password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
  };
  const client = mqtt.connect(
    `ws://${process.env.NEXT_PUBLIC_MQTT_WS_HOST}:${process.env.NEXT_PUBLIC_MQTT_WS_PORT}`,
    clientOpts
  );

  useEffect(() => {
    async function fetchInitialData() {
      console.log("Fetching inital data");
      const devices = await fetchDevices();
      if (devices) {
        console.log("Devices:", devices);
        setDevices(devices);
        for (const device of devices) {
          const telemetry = await fetchDeviceTelemetry(device.id);
          if (telemetry) {
            device.telemetry = telemetry;
            setDevices((prevDevices) =>
              prevDevices.map((d) => (d.id === device.id ? device : d))
            );
          }
        }
      } else {
        console.log("Failed to fetch devices");
      }
    }
    fetchInitialData();

    client.on("connect", () => {
      client.subscribe("assets/+", (err) => {
        if (err) {
          console.log(err);
        }
      });
    });

    client.on("message", (topic, message) => {
      console.log(topic, message.toString());
      const [_, id] = topic.split("/");
      const deviceId = parseInt(id);

      setDevices((prevDevices) => {
        const device = prevDevices.find((device) => device.id === deviceId);
        if (device) {
          const data = JSON.parse(message.toString());
          console.log("Got message data:", data);
          device.status = data.status;
          const formattedTelemetry = {
            timestamp: new Date().toISOString(),
            telemetry: data.telemetry as TelemetryData,
          };
          device.telemetry = [formattedTelemetry, ...device.telemetry];
          return prevDevices.map((d) => (d.id === deviceId ? device : d));
        } else {
          console.log("Device not found", id);
          return prevDevices;
        }
      });
    });
  }, []);

  useEffect(() => {
    console.log("Devices updated:", devices);
  }, [devices]);

  return (
    <div>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table table-zebra table-lg">
          <thead className="table-header">
            <tr>
              <td>ID</td>
              <td>Name</td>
              <td>Status</td>
              <td>Telemetry</td>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.id}>
                <td className="w-20">{device.id}</td>
                <td className="w-32">{device.name}</td>
                <td
                  className={`w-32 ${
                    device.status == "online"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {device.status}
                </td>
                <td className="flex justify-end">
                  <TelemetryGraph data={device.telemetry} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
