"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
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
    username: "trist",
    password: "1234",
  };
  const client = mqtt.connect("ws://localhost:8000", clientOpts);

  client.on("connect", () => {
    client.subscribe("assets/+", (err) => {
      if (err) {
        console.log(err);
      }
    });
  });

  client.on("message", (topic, message) => {
    const [_, id] = topic.split("/");
    const device = devices.find((device) => device.id === Number(id));
    if (device) {
      device.telemetry = JSON.parse(message.toString());
      setDevices([...devices]);
    } else {
      fetchClient(id)
        .then((data) => {
          const device = data as Device;
          setDevices([...devices, device]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

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
