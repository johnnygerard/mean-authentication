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

const ports = [3000, 3001, 4200];
console.log("Waiting for servers on ports:", ports);
await Promise.all(ports.map(waitServer));
console.log("All servers ready! 🚀");
