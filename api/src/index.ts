import express, { Request, Response } from "express";
import { MergeRouterPDF } from "./routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use("/api/", MergeRouterPDF);

app.listen(port, () => {
  console.log("Server is running on http://localhost:" + port);
});
