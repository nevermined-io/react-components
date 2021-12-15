#!/bin/bash

# Wait for contracts migration and extract Keeper artifacts

RETRY_COUNT=0
COMMAND_STATUS=1

RED='\e[31m'
NC='\e[0m' # No Color
YELLOW='\e[33m'
GREEN='\e[32m'

printf "\n${RED}◯ Keep in mind to run this script from client root! ◯${NC}"

printf "\n${YELLOW}◯ Waiting for contracts to be generated...${NC}\n"

mkdir -p artifacts

until [ $COMMAND_STATUS -eq 0 ] || [ $RETRY_COUNT -eq 120 ]; do
  cat ~/.nevermined/nevermined-contracts/artifacts/ready
  COMMAND_STATUS=$?
  if [ $COMMAND_STATUS -eq 0 ]; then
    break
  fi
  sleep 5
  let RETRY_COUNT=RETRY_COUNT+1
done

printf "${GREEN}✔ Found new contract artifacts.${NC}\n"

rm -rf ./artifacts/

if [ $COMMAND_STATUS -ne 0 ]; then
  printf "${RED}Waited for more than two minutes, but nevermined contracts have not been migrated yet. Did you run an Ethereum RPC client and the migration script?${NC}"
  exit 1
fi

cp -r ~/.nevermined/nevermined-contracts/artifacts/. node_modules/@nevermined-io/contracts/artifacts/

printf "${GREEN}✔ Copied new contract artifacts.${NC}\n"
