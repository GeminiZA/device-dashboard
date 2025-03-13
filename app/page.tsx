"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";
import fetchClient from "./actions";

interface Device {
  id: number;
  name: string;
  status: string;
  telemetry: any;
}

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
      const device = devices.find((device) => device.id === Number(id));
      if (device) {
        const data = JSON.parse(message.toString());
        console.log("Got message data:", data);
        device.status = data.status;
        device.telemetry = data.telemetry;
        setDevices([...devices, device]);
      } else {
        console.log("Fetching device", id);
        fetchClient(id)
          .then((data) => {
            console.log(data);
            const device = data as Device;
            setDevices([...devices, device]);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }, []);

  return (
    <div>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table table-zebra">
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
                <td>{device.id}</td>
                <td>{device.name}</td>
                <td>{device.status}</td>
                <td>
                  <ul>
                    {Object.entries(device.telemetry).map(([key, value]) => (
                      <li key={`${device.id}-${key}}`}>{`${key}: ${value}`}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
