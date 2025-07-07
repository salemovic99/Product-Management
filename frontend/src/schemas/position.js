import { z } from "zod";

export const positionSchema = z.object({
  name: z.coerce.string().min(3, { message: 'Position name is required' }),
});