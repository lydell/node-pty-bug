# node-pty bug

When running ptys in parallel, some of them unexpectedly receive “signal 1” (SIGHUP?) and exit early.

This happens in ubuntu-latest on GitHub Actions. But not in macOS-latest. And not my own Ubuntu machine (and not on my own macOS machine either).

Steps to reproduce:

1. Clone this repo
2. `npm ci`
3. `node test.js`

Check the Actions tab on this repo to see runs on ubuntu-latest (which fail) and macOS-latest (which succeed).
