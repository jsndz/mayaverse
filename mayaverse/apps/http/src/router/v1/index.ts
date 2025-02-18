import { Router } from "express";
import userRouter from "./user";
import adminRouter from "./admin";
import spaceRouter from "./space";
import { signInSchema, signUpSchema } from "../../types";
import client from "@repo/db/client";
import { hash, compare } from "../../scrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Hello Router ",
  });
});

router.post("/signup", async (req, res) => {
  const parsedData = signUpSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }
  const hashedPassword = await hash(parsedData.data.password);
  try {
    const user = await client.user.create({
      data: {
        username: parsedData.data.username,
        password: hashedPassword,
        role: parsedData.data.type === "admin" ? "Admin" : "User",
      },
    });
    res.status(200).json({
      userId: user.id,
    });
  } catch (error) {
    res.status(400).json({
      message: "User already exists",
    });
  }
});
router.post("/signin", async (req, res) => {
  const parsedData = signInSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }
  try {
    const user = await client.user.findUnique({
      where: {
        username: parsedData.data.username,
      },
    });
    if (!user) {
      res.status(403).json({
        message: "User does not exists",
      });
      return;
    }
    const passwordMatch = await compare(
      parsedData.data.password,
      user.password
    );
    if (!passwordMatch) {
      res.status(403).json({
        message: "Invalid password",
      });
      return;
    }
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_SECRET!
    );
    res.status(200).json({
      token: token,
    });
  } catch (error) {
    console.log(error);

    res.status(403).json({
      message: "Internal server error",
    });
  }
});

router.get("/element", async (req, res) => {
  const elements = await client.element.findMany();
  res.json({
    elements: elements.map(
      (element: {
        id: any;
        imageUrl: any;
        static: any;
        width: any;
        height: any;
      }) => ({
        id: element.id,
        imageUrl: element.imageUrl,
        static: element.static,
        width: element.width,
        height: element.height,
      })
    ),
  });
});
router.get("/avatars", async (req, res) => {
  const avatars = await client.avatar.findMany();

  res.json({
    avatars: avatars.map((avatar: { id: any; imageUrl: any; name: any }) => ({
      id: avatar.id,
      imageUrl: avatar.imageUrl,
      name: avatar.name,
    })),
  });
});

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/space", spaceRouter);
export { router };
