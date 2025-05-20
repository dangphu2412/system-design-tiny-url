import z from 'zod';

export const CreateUrlDTOSchema = z.object({
  url: z.string().url().max(2048),
});

export type CreateUrlDTO = z.infer<typeof CreateUrlDTOSchema>;
