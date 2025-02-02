import { Router } from "express";

const router = Router();

router.post("/metadata", (req, res) => {
  res.json({
    message: "Hello",
  });
});
router.get("/metadata/bulk", (req, res) => {
  res.json({
    message: "Hello",
  });
});

export default router;
