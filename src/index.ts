import express, { Express } from "express";
import dotenv from "dotenv";
import notesLoggerMiddleware from "./middlewares/notesLoggerMiddleware";
import rootRouter from "./routes/rootRouter";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(notesLoggerMiddleware);
app.use("/", rootRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
