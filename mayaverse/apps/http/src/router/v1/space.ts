import { Router } from "express";

const router = Router();

router.get("/:spaceId", (req, res) => {
  res.json({
    message: "Hello",
  });
});
router.post("/", (req, res) => {
  res.json({
    message: "Hello",
  });
});
router.delete("/:spaceId", (req, res) => {
  res.json({
    message: "Hello",
  });
});
router.get("/all", (req, res) => {
  res.json({
    message: "Hello",
  });
});
router.post("/element", (req, res) => {
  res.json({
    message: "Hello",
  });
});
router.delete("/element", (req, res) => {
  res.json({
    message: "Hello",
  });
});
export default router;
