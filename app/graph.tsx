import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { TelemetryData, TelemetryEntry } from "./types";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TelemetryGraphProps {
  data: TelemetryEntry[];
}

const TelemetryGraph: React.FC<TelemetryGraphProps> = ({ data }) => {
  // Extract timestamps, humidity, and temperature from the data
  const timestamps = data.map((entry) =>
    new Date(entry.timestamp).toLocaleDateString()
  );
  const humidityData = data.map((entry) => entry.telemetry.humidity);
  const temperatureData = data.map((entry) => entry.telemetry.temperature);

  // Chart.js data configuration
  const chartData = {
    labels: timestamps,
    datasets: [
      {
        label: "Humidity (%)",
        data: humidityData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y",
      },
      {
        label: "Temperature (°C)",
        data: temperatureData,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        yAxisID: "y1",
      },
    ],
  };

  // Chart.js options configuration
  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Humidity (%)",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "Temperature (°C)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Telemetry Data Over Time",
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default TelemetryGraph;
