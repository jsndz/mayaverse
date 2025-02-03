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

  const metadata = await client.user.update({
    where: {
      id: req.userId,
    },
    data: {
      avatarId: parsedData.data.avatar,
    },
  });
  res.status(200).json({
    message: "Metadata updated",
  });
});
router.get("/metadata/bulk", async (req, res) => {
  const userIds = (req.query.userIds ?? "[]") as string;
  const ids = userIds.slice(1, userIds?.length - 2).split(",");
  const metadata = await client.user.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      avatar: true,
      id: true,
    },
  });

  res.status(200).json({
    avatars: metadata.map((m) => {
      userId: m.id;
      avatarId: m.avatar?.imageUrl;
    }),
  });
});

export default router;
