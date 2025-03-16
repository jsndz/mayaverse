import { Router } from "express";
import { updateMetaDataSchema } from "../../types";
import client from "@repo/db/client";
import { UserMiddleware } from "../../middleware/user";

const router = Router();

router.post("/metadata", UserMiddleware, async (req, res) => {
  const parsedData = updateMetaDataSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Validation Failed",
    });
    return;
  }

  try {
    const metadata = await client.user.update({
      where: {
        id: req.userId,
      },
      data: {
        avatarId: parsedData.data.avatarId,
      },
    });
    res.status(200).json({
      message: "Metadata updated",
    });
  } catch (error) {
    res.status(400).json({
      message: "Internal Server Error",
    });
  }
});
router.get("/metadata/bulk", async (req, res) => {
  const userIds = (req.query.ids ?? "[]") as string;
  const ids = userIds.slice(1, userIds?.length - 1).split(",");

  const metadata = await client.user.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      avatar: true,
      id: true,
      username: true,
    },
  });

  res.status(200).json({
    avatars: metadata.map((m) => ({
      userId: m.id,
      avatarId: m.avatar?.imageUrl,
      name: m.username,
    })),
  });
});

router.get("/metadata/:userId", async (req, res) => {
  const userId = req.params.userId;
  const metadata = await client.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      avatar: true,
      id: true,
      username: true,
    },
  });

  res.status(200).json({
    avatar: {
      name: metadata?.username,
      avatar: metadata?.avatar?.imageUrl,
    },
  });
});

export default router;
