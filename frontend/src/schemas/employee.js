import { z } from "zod";

export const employeeSchema = z.object({
  name: z.coerce
  .string()
  .regex(/^[A-Za-z\s]+$/, { message: "Name must contain only letters" })
  .min(3, { message: "Name is required" }),

  employee_id: z.coerce
  .number()
  .min(1)
  .max(2147483647),

  phone_number: z.coerce
  .string()
  .min(8, { message: "Phone number must be at least 8 digits" })
  .max(9, { message: "Phone number must not exceed 9 digits" })
  .regex(/^\d+$/, { message: "Phone number must contain only digits" }),

  position_id: z.coerce
  .string()
  .min(1, { message: "Position is required" }),
});