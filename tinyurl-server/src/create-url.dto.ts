import z from 'zod';

export const CreateUrlDTOSchema = z.object({
  id: z.string().length(7),
  url: z.string().url().max(2048),
});

export type CreateUrlDTO = z.infer<typeof CreateUrlDTOSchema>;
