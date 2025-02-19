import { Router } from "express";
import {
  addElementSchema,
  createSpaceSchema,
  deletelementSchema,
} from "../../types";
import client from "@repo/db/client";
import { UserMiddleware } from "../../middleware/user";

const router = Router();

router.get("/all", UserMiddleware, async (req, res) => {
  try {
    const spaces = await client.space.findMany({
      where: {
        creatorId: req.userId,
      },
    });

    res.status(200).json({
      spaces: spaces.map((space) => ({
        id: space.id,
        name: space.name,
        dimension: `${space.width}x${space.height}`,
        thumbnail: space.thumbnail,
      })),
    });
  } catch (error) {
    res.status(400).json({
      message: "No spaces found",
    });
  }
});

router.get("/:spaceId", async (req, res) => {
  const spaceId = req.params.spaceId;
  const space = await client.space.findUnique({
    where: {
      id: spaceId,
    },
    include: {
      elements: {
        include: {
          element: true,
        },
      },
    },
  });
  if (!space) {
    res.status(400).json({
      message: "Space doesn't exist",
    });
    return;
  }

  res.json({
    dimension: `${space.width}x${space.height}`,
    elements: space.elements.map((e) => ({
      id: e.id,
      element: {
        id: e.element.id,
        imageUrl: e.element.imageUrl,
        static: e.element.static,
        width: e.element.width,
        height: e.element.height,
      },
      x: e.x,
      y: e.y,
    })),
  });
});
router.post("/", UserMiddleware, async (req, res) => {
  const parsedData = createSpaceSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Validation failed" });
    return;
  }

  if (!parsedData.data.mapId) {
    const space = await client.space.create({
      data: {
        name: parsedData.data.name,
        width: parseInt(parsedData.data.dimension.split("x")[0]),
        height: parseInt(parsedData.data.dimension.split("x")[1]),
        creatorId: req.userId!,
      },
    });
    res.json({ spaceId: space.id });
    return;
  }

  const map = await client.map.findFirst({
    where: {
      id: parsedData.data.mapId,
    },
    select: {
      mapElements: true,
      width: true,
      height: true,
    },
  });
  if (!map) {
    res.status(400).json({ message: "Map not found" });
    return;
  }
  let space = await client.$transaction(async () => {
    const space = await client.space.create({
      data: {
        name: parsedData.data.name,
        width: map.width,
        height: map.height,
        creatorId: req.userId!,
      },
    });

    await client.spaceElements.createMany({
      data: map.mapElements.map((e) => ({
        spaceId: space.id,
        elementId: e.elementId,
        x: e.x!,
        y: e.y!,
      })),
    });

    return space;
  });
  res.json({ spaceId: space.id });
});
router.delete("/element", UserMiddleware, async (req, res) => {
  const parsedData = deletelementSchema.safeParse(req.body);
  if (!parsedData) {
    res.status(400).json({
      message: "Validation Failed",
    });
    return;
  }
  const spaceElement = await client.spaceElements.findUnique({
    where: {
      id: parsedData.data?.id,
    },
    select: {
      space: true,
    },
  });
  if (spaceElement?.space?.creatorId !== req.userId || !spaceElement) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }

  await client.spaceElements.delete({
    where: {
      id: parsedData.data?.id,
    },
  });
  res.status(200).json({
    message: "Element Deleted",
  });
});
router.delete("/:spaceId", UserMiddleware, async (req, res) => {
  const spaceId = req.params.spaceId;

  const space = await client.space.findUnique({
    where: {
      id: spaceId,
    },
    select: {
      creatorId: true,
    },
  });
  if (!space) {
    res.status(400).json({
      message: "Space doesn't exist",
    });
    return;
  }
  if (space?.creatorId !== req.userId) {
    res.status(403).json({
      message: "You are not allowed to delete this space",
    });
    return;
  }
  await client.space.delete({
    where: {
      id: spaceId,
    },
  });
  res.json({
    message: "Space Deleted",
  });
});

router.post("/element", UserMiddleware, async (req, res) => {
  const parsedData = addElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Validation Failed",
    });
    return;
  }
  const space = await client.space.findUnique({
    where: {
      id: parsedData.data.spaceId,
      creatorId: req.userId!,
    },
    select: {
      width: true,
      height: true,
    },
  });
  if (!space) {
    res.status(400).json({
      message: "Space doesn't exist",
    });
    return;
  }
  if (parsedData.data.x > space.width || parsedData.data.y > space.height) {
    res.status(400).json({
      message: "Invalid coordinates",
    });
    return;
  }
  await client.spaceElements.create({
    data: {
      elementId: req.body.elementId,
      x: req.body.x,
      y: req.body.y,
      spaceId: req.body.spaceId,
    },
  });
  res.status(201).json({ message: "Element added" });
});

export default router;
