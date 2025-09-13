'use server';

import { z } from 'zod';

const schema = z.object({
  email: z.email({
    error: 'Invalid Email',
  }),
});

export const submitForm = async (prevState: any, formData: FormData) => {
  const email = formData.get('email');
  const validatedFields = schema.safeParse({
    email,
  });

  if (!validatedFields.success) {
    if (validatedFields.error instanceof z.ZodError) {
      return {
        error: z.flattenError(validatedFields.error),
        values: {
          email: String(email || ''),
        },
      };
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  // TODO: do something, like sending an email

  return null;
};
