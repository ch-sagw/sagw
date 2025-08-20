import dotenv from 'dotenv';

const envs = [
  'local',
  'playwright',
  'prod',
  'test',
];

if (process.env.CI !== 'true') {
  dotenv.config({
    override: true,
    path: '.env/.env.base',
    quiet: true,
  });

  if (envs.includes(process.env.ENV)) {
    dotenv.config({
      override: true,
      path: `.env/.env.${process.env.ENV}`,
      quiet: true,
    });
  }
}
