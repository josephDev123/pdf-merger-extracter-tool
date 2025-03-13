import express, { Request, Response } from "express";
import { MergeRouterPDF } from "./routes/mergeRoutes";
import dotenv from "dotenv";
import { SplitRouterPDF } from "./routes/splitRouter";
import cors from "cors";
import { GlobalErrorMiddleware } from "./middleware/GlobalError";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = [
  process.env.ALLOW_ACCESS_ORIGIN_LOCAL,
  process.env.ALLOW_ACCESS_ORIGIN_REMOTE,
  process.env.ALLOW_ACCESS_ORIGIN_NGINX_PORT,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// console.log(process.env.ALLOW_ACCESS_ORIGIN_LOCAL)
app.use("/api/", MergeRouterPDF);
app.use("/api/", SplitRouterPDF);
app.use("/api/testing", (req: Request, res: Response) => {
  res.send("hello world");
  return;
});
app.use(GlobalErrorMiddleware);

app.listen(port, () => {
  console.log("Server is running on http://localhost:" + port);
});
