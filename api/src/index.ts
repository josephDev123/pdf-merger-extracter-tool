import express, { Request, Response } from "express";
import { MergeRouterPDF } from "./routes/mergeRoutes";
import dotenv from "dotenv";
import { SplitRouterPDF } from "./routes/splitRouter";
import cors from "cors";
import { GlobalErrorMiddleware } from "./middleware/GlobalError";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = ["http://localhost:3000"];

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

app.use("/api/", MergeRouterPDF);
app.use("/api/", SplitRouterPDF);
app.use(
  (err: Error, req: Request, res: Response, next: express.NextFunction) => {
    GlobalErrorMiddleware(err, req, res, next);
  }
);

app.listen(port, () => {
  console.log("Server is running on http://localhost:" + port);
  // console.log(
  //   process.env.PORT,
  //   process.env.AWS_ACCESS_KEY,
  //   process.env.AWS_SECRET_ACCESS_KEY,
  //   process.env.CLOUDFRONT_URL
  // );
});
