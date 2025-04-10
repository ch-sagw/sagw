#!/bin/bash
 
if [[ $VERCEL_TARGET_ENV == "production"  ]] ; then 
  npm run build:prod
else 
  npm run build
fi