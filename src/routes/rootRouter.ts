import { Router, Request, Response } from "express";
import notesRouter from "./notesRouter";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    paths: {
      "/notes": "GET, POST",
      "/notes/stats": "GET",
      "/notes/:id": "GET, PATCH, DELETE",
    },
  });
});
router.use("/notes", notesRouter);

export default router;
