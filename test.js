#!/usr/bin/env node
const pty = require("node-pty");

// Run `child.js` 5 times, passing the exit code we want from it and after how long time in milliseconds.
const configurations = [
  { exitCode: 0, runTime: 700 },
  { exitCode: 0, runTime: 700 },
  { exitCode: 0, runTime: 2000 },
  { exitCode: 0, runTime: 700 },
  { exitCode: 1, runTime: 700 },
];

const queue = configurations.map((configuration, i) =>
  run(i + 1, configuration)
);

const receivedExitCodes = [];

function run(i, configuration) {
  return () => {
    console.log("Start", i);

    let buffer = "";

    const terminal = pty.spawn(
      "node",
      [
        "child.js",
        configuration.exitCode.toString(),
        configuration.runTime.toString(),
      ],
      {}
    );

    terminal.onData((data) => {
      buffer += data;
    });

    terminal.onExit(({ exitCode, signal }) => {
      console.log("Exit", i, { exitCode, signal });
      console.log(buffer);
      receivedExitCodes.push(exitCode);

      const next = queue.shift();
      if (next !== undefined) {
        // Start the next in the queue, if there are any left.
        next();
      } else if (receivedExitCodes.length === configurations.length) {
        // When done, see if we got the expected output.
        console.log("receivedExitCodes", receivedExitCodes);
        const isExpected =
          receivedExitCodes.filter((code) => code === 1).length === 1;
        if (isExpected) {
          console.log("✅ Expected output");
          process.exit(0);
        } else {
          console.log("🚨 Unexpected output. Expected one single exit code 1.");
          process.exit(1);
        }
      }
    });
  };
}

// Start running, 2 at a time.
for (let i = 0; i < 2; i++) {
  queue.shift()?.();
}
