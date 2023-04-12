#!/bin/bash

# Change to the app directory
cd /home/ross/Documents/git/DST_LiquidDispenser

# If a tmux session named 'server' exists, kill it
if tmux has-session -t server 2>/dev/null; then
  tmux kill-session -t server
fi

# Start a new tmux session named 'server' running the 'serve -s build/' command
tmux new-session -d -s server 'serve -s build/'
