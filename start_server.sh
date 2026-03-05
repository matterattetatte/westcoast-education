#!/bin/bash

npx json-server db.json --port 3000 &

npx tsc --watch &

wait