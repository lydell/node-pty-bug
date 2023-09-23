# node-pty bug

When running ptys in parallel, some of them unexpectedly receive “signal 1” (SIGHUP?) and exit early.

This happens in ubuntu-latest on GitHub Actions. But not in macOS-latest. And not my own Ubuntu machine (and not on my own macOS machine either).

Steps to reproduce:

1. Clone this repo
2. `npm ci`
3. `node test.js`

Check the [Actions tab](https://github.com/lydell/node-pty-bug/actions) on this repo to see runs on ubuntu-latest (which fail) and macOS-latest (which succeed).

Expected output:

```
Start 1
Start 2
Exit 2 { exitCode: 0, signal: 0 }
start
end

Start 3
Exit 1 { exitCode: 0, signal: 0 }
start
end

Start 4
Exit 4 { exitCode: 0, signal: 0 }
start
end

Start 5
Exit 5 { exitCode: 1, signal: 0 }
start
end

Exit 3 { exitCode: 0, signal: 0 }
start
end

receivedExitCodes [ 0, 0, 0, 1, 0 ]
✅ Expected output
```

Note:

- All but one pty exits with code 0. One exits with code 1, by design.
- All ptys have signal 0.
- All ptys print "start" and "end".

Bad output, on ubuntu-latest in GitHub Actions:

```
Start 1
Start 2
Exit 1 { exitCode: 0, signal: 0 }
start
end

Start 3
Exit 2 { exitCode: 0, signal: 0 }
start
end

Start 4
Exit 4 { exitCode: 0, signal: 1 }
start

Start 5
Exit 5 { exitCode: 0, signal: 1 }
start

Exit 3 { exitCode: 0, signal: 0 }
start
end

receivedExitCodes [ 0, 0, 0, 0, 0 ]
🚨 Unexpected output. Expected one single exit code 1.
```

Note:

- _All_ ptys exit with code 0, but one of them is supposed to exit with code 1.
- Some ptys get signal 1, and only print "start" and not "end". It looks like they are interrupted before getting a chance to finish. Why?
