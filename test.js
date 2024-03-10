const pty = require("node-pty");

let buffer1 = "";
const terminal1 = pty.spawn("sleep", ["1"], {});
terminal1.onData((data) => {
  buffer1 += data;
});
terminal1.onExit(({ exitCode, signal }) => {
  console.log("\nExit 1", { exitCode, signal });
  console.log(buffer1);
  if (signal === 1) {
    console.log("✅ Got the expected signal 1");
  } else {
    console.log("❌ Expected signal 1, got", signal);
    process.exitCode = 1;
  }
});

let buffer2 = "";
const terminal2 = pty.spawn("sleep", ["1"], {});
terminal2.onData((data) => {
  buffer2 += data;
});
terminal2.onExit(({ exitCode, signal }) => {
  console.log("\nExit 2", { exitCode, signal });
  console.log(buffer2);
  if (signal === 0) {
    console.log("✅ Got the expected signal 0");
  } else {
    console.log("❌ Expected signal 0, got", signal);
    process.exitCode = 1;
  }
});

setTimeout(() => {
  terminal1.kill();
}, 500);
