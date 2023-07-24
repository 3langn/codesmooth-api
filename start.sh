#!/bin/bash

./grafana-agent-linux-amd64 --config.file=agent-config.yaml &
npm start
