import { z } from "zod";

export const productSchema = z.object({
  name: z.coerce.string().regex(/[A-Za-z]/, { message: "Name must contain at least one letter",  }).min(3, { message: "Product name is required" }),
  serial_number: z.string().min(8, { message: "Serial number is required" }).max(20, {message :"Serial number must not exceed 20 characters"}),
  our_serial_number: z.string().min(15, { message: "Our serial is required" }),
  location_id: z.coerce.number().min(1, { message: "Location is required" }),
  status_id: z.coerce.number().min(1, { message: "Status is required" }),
  in_warehouse: z.boolean(),
  note: z.string().regex(/^[A-Za-z\s]+$/, { message: "Name must contain only letters and spaces",}).min(10, { message: "Note is required" }),
  purchasing_date: z.coerce.date({
    required_error: "Purchasing date is required",
    invalid_type_error: "Invalid date"
  }),
  warranty_expire: z.date().optional(),
});