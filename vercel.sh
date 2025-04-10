#!/bin/bash
 
if [[ $VERCEL_TARGET_ENV == "production"  ]] ; then 
  npm run build:prod
elif [[ $VERCEL_TARGET_ENV == "staging"  ]] ; then 
  npm run build:staging
else 
  npm run build
fi