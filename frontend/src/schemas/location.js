import { z } from "zod";

export const locationSchema = z.object({
  name: z.coerce
  .string()
  .min(3, { message: 'Location name is required' }),

  google_map_link: z.coerce
  .string()
  .url({ message: 'Please enter a valid Google Maps URL' }),
});