import { Router } from "express";
import userRouter from "./user";
import adminRouter from "./admin";
import spaceRouter from "./space";

const router = Router();

router.post("/signin", (req, res) => {
  res.json({
    message: "Hello",
  });
});
router.post("/signup", (req, res) => {
  res.json({
    message: "Hello",
  });
});

router.post("/element", (req, res) => {
  res.json({
    message: "Hello",
  });
});
router.post("/avatars", (req, res) => {
  res.json({
    message: "Hello",
  });
});

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/space", spaceRouter);
export { router };
