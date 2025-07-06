#!/bin/bash

# This script runs during building the sandbox template
# and makes sure the Next.js app is (1) running and (2) the `/` page is compiled
function ping_server() {
	counter=0
	response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000")
	while [[ ${response} -ne 200 ]]; do
	  let counter++
	  if  (( counter % 20 == 0 )); then
        echo "Waiting for server to start..."
        sleep 0.1
      fi

	  response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000")
	done
}

ping_server &
cd /home/user && npm run dev


# docker build -f e2b.Dockerfile --pull --platform linux/amd64 -t docker.e2b.app/e2b/custom-envs/f1pgjqf9wrrbx5tatm2m:801d099a-c22a-4877-8517-09f65da56621 .