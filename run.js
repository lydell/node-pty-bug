#!/usr/bin/env node
const childProcess = require("child_process");

childProcess.spawn("node", ["test.js"], {
  stdio: "inherit",
  env: { ...process.env, UV_USE_IO_URING: "0" },
}).on('exit', process.exit);
