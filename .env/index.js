import dotenv from 'dotenv';

const envs = [
  'local',
  'playwright',
  'prod',
  'test',
];

// Auto-detect Vercel production environment if ENV is not already set
if (!process.env.ENV && process.env.VERCEL_ENV === 'production') {
  process.env.ENV = 'prod';
}

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

  if (process.env.ENV === 'seed') {
    dotenv.config({
      override: true,
      path: '.env/.env.local',
      quiet: true,
    });
  }

}
