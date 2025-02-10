import { Router } from "express";
import {
  createAvatarSchema,
  createElementSchema,
  createMapSchema,
  updateElementSchema,
} from "../../types";
import client from "@repo/db/client";
import { AdminMiddleware } from "../../middleware/admin";

const router = Router();
router.use(AdminMiddleware);
router.post("/element", async (req, res) => {
  const parsedData = createElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Validation Failed",
    });
    return;
  }
  const element = await client.element.create({
    data: {
      imageUrl: parsedData.data.imageUrl,
      static: parsedData.data.static,
      width: parsedData.data.width,
      height: parsedData.data.height,
    },
  });
  res.json({
    id: element.id,
  });
});
router.put("/element/:elementId", (req, res) => {
  const parsedData = updateElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Validation Failed",
    });
    return;
  }
  const elementId = req.params.elementId;
  client.element.update({
    where: {
      id: elementId,
    },
    data: {
      imageUrl: parsedData.data.imageUrl,
    },
  });
  res.json({
    message: "Updated",
  });
});
router.post("/map", async (req, res) => {
  const parsedData = createMapSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({
      message: "Validation Failed",
    });
    return;
  }

  const map = await client.map.create({
    data: {
      name: parsedData.data.name,
      thumbnail: parsedData.data.thumbnail,
      width: parseInt(parsedData.data.dimension.split("x")[0]),
      height: parseInt(parsedData.data.dimension.split("x")[1]),
      mapElements: {
        create: parsedData.data.defaultElements?.map((element) => ({
          elementId: element.elementId,
          x: element.x,
          y: element.y,
        })),
      },
    },
  });

  res.json({
    id: map.id,
  });
});
router.post("/avatar", async (req, res) => {
  const parsedData = createAvatarSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Validation Failed",
    });
    return;
  }
  const avatar = await client.avatar.create({
    data: {
      imageUrl: parsedData.data.imageUrl,
      name: parsedData.data.name,
    },
  });
  res.json({
    id: avatar.id,
  });
});
export default router;
