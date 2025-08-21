#!/bin/bash

# since we run 2 vercel projects (1 for payload / nextjs and 
# one for storybook), we want `npm run build` only for payload.

if [[ $VERCEL_PROJECT_ID == "prj_kpN8C9D0xuT3v4qY561mmroJ6MSG"  ]] ; then
  npm run build
fi
