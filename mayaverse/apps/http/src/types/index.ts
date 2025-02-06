import z from "zod";

export const signUpSchema = z.object({
  username: z.string(),
  password: z.string(),
  type: z.enum(["user", "admin"]),
});

export const signInSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

export const updateMetaDataSchema = z.object({
  avatarId: z.string(),
});

export const createSpaceSchema = z.object({
  name: z.string(),
  dimension: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
  mapId: z.string(),
});

export const addElementSchema = z.object({
  x: z.number(),
  y: z.number(),
  elementId: z.string(),
  spaceId: z.string(),
});

export const deletelementSchema = z.object({
  id: z.string(),
});
export const createElementSchema = z.object({
  imageUrl: z.string(),
  static: z.boolean(),
  width: z.number(),
  height: z.number(),
});

export const updateElementSchema = z.object({
  imageUrl: z.string(),
});

export const createAvatarSchema = z.object({
  imageUrl: z.string(),
  name: z.string(),
});

export const createMapSchema = z.object({
  thumbnail: z.string(),
  dimension: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
  name: z.string(),
  defaultElements: z.array(
    z.object({
      elementId: z.string(),
      x: z.number(),
      y: z.number(),
    })
  ),
});

declare global {
  namespace Express {
    interface Request {
      userId: string;
      roel: "Admin" | "User";
    }
  }
}
