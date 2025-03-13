# Device Manager Dashboard

## Getting Started

#### Requirements

- nodejs
- npm

Create .env file

```
NEXT_PUBLIC_MQTT_WS_HOST=localhost
NEXT_PUBLIC_MQTT_WS_PORT=8000
NEXT_PUBLIC_MQTT_USERNAME=test
NEXT_PUBLIC_MQTT_PASSWORD=1234
```

Run `npm install`

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

access with `http://localhost:3000`

For now this only processes updates from devices registered to the api before the page is loaded

All live updates are fetched from the MQTT broker

Run the [mock devices](https://github.com/GeminiZA/mock-iot-device) to simulate real time updates from any number of devices. The mock devices script needs to be run at least once before rendering the webpage to register the devices with the api due to the limitation of the demonstration webpage
