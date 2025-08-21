#!/bin/bash

if [[ $VERCEL_PROJECT_ID == "prj_kpN8C9D0xuT3v4qY561mmroJ6MSG"  ]] ; then
  if [[ $VERCEL_TARGET_ENV == "production"  ]] ; then 
    npm run build:prod
  else 
    npm run build
  fi
fi
