export interface TelemetryEntry {
  timestamp: string;
  telemetry: TelemetryData;
}

export interface TelemetryData {
  humidity: number;
  temperature: number;
}

export interface Device {
  id: number;
  name: string;
  status: string;
  telemetry: TelemetryEntry[];
}
