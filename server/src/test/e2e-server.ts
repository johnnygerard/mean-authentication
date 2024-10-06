/**
 * @file Test server for e2e global setup and teardown.
 */
import express from "express";
import { NO_CONTENT } from "../constants/http-status-code.js";
import { users } from "../database/mongo-client.js";

const HOST = "localhost";
const PORT = 3001;
const app = express();

app.post("/teardown", async (req, res) => {
  await users.deleteMany();
  res.status(NO_CONTENT).end();
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening at http://${HOST}:${PORT}`);
});
