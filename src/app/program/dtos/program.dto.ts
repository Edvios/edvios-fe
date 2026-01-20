import {z} from "zod";

export const programFilterRequest = {
    title: z.string().optional(),
    
}



export const programFilterResponse = z.object({});
