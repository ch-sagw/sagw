import dotenv from 'dotenv';

dotenv.config({
  override: true,
  path: '.env/.env.base',
});

dotenv.config({
  override: true,
  path: `.env/.env.${process.env.ENV}`,
});
