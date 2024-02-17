#!/usr/bin/env node
const childProcess = require("child_process");

childProcess.spawn(process.execPath, [`${__dirname}/test.js`], {
  stdio: "inherit",
  env: { UV_USE_IO_URING: "0", ...process.env },
}).on('exit', process.exit);
