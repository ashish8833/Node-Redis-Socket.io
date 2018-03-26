# Redis Socket.io Integration

## Problem
Node.js has single thread application, if you have multiple core **CPU**, Node application use only one core, can't get advantage of mutiple core **CPU**. For **REST-API**, it's easy to generate multiple copy of node project that runs on different port, but for socket can't mange.

## Solution
### Step 1: 
Use Inbuilt library [Socket.io-redis](https://github.com/socketio/socket.io-redis) 
Create multipel instance of your project that's run differen port that handle Inter process communication for event.

### Step 2:
Work in progress...