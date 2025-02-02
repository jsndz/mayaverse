import { Router } from "express";

const router = Router();

router.post("/element", (req, res) => {
  res.json({
    message: "Hello",
  });
});
router.put("/element/:elementId", (req, res) => {
  res.json({
    message: "Hello",
  });
});
router.post("/map", (req, res) => {
  res.json({
    message: "Hello",
  });
});
router.post("/avatar", (req, res) => {
  res.json({
    message: "Hello",
  });
});
export default router;
