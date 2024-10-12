import { Socket } from "node:net";

const HOST = "localhost";
const TIMEOUT = 10;

const isNotConnected = async (port) => {
  return new Promise((resolve) => {
    const socket = new Socket();

    socket.on("error", (e) => {
      if (e.code === "ECONNREFUSED") {
        resolve(true);
        return;
      }

      throw e;
    });

    socket.connect(port, HOST, () => {
      socket.destroy();
      resolve(false);
    });
  });
};

const waitServer = async (port) => {
  while (await isNotConnected(port))
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT));
  console.log(`Server on port ${port} is ready`);
};

const EXPRESS = 3000;
const EXPRESS_E2E = 3001;
const ANGULAR = 4200;
const REDIS_STACK = 6379;
const REDIS_INSIGHT = 8001;
const MONGODB = 27017;

const ports = [
  EXPRESS,
  EXPRESS_E2E,
  ANGULAR,
  REDIS_STACK,
  REDIS_INSIGHT,
  MONGODB,
];

console.log("Waiting for servers on ports:", ports);
await Promise.all(ports.map(waitServer));
console.log("All servers ready! 🚀");
