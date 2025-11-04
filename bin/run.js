#!/usr/bin/env node
const { execFile } = require("child_process");
const path = require("path");

// --- Map Node.js platform/arch to Go's ---
const platformMap = {
  win32: "windows",
  linux: "linux",
  darwin: "darwin",
};
const archMap = {
  x64: "amd64",
  arm64: "arm64",
};

const goPlatform = platformMap[process.platform];
const goArch = archMap[process.arch];

if (!goPlatform || !goArch) {
  console.error(
    `Error: Unsupported platform/architecture: ${process.platform}/${process.arch}`
  );
  console.error("Please open an issue to request support for your platform.");
  process.exit(1);
}
// --- End Mapping ---

let binaryName = "tommysayshi";
if (goPlatform === "windows") {
  binaryName += ".exe";
}

const binaryPath = path.join(
  __dirname,
  "..",
  "dist",
  `${goPlatform}-${goArch}`,
  binaryName
);

// Run the binary and pass all arguments
const child = execFile(binaryPath, process.argv.slice(2), (err) => {
  // The callback now *only* handles errors.
  // stdout and stderr are handled by the pipes below.
  if (err) {
    // If the process exits with an error, 'err' will be populated.
    // The stderr will have already been piped, so we just exit.
    process.exit(err.code || 1);
  }
});

// Pipe the child's stdout/stderr to the main process in real-time
// This is the *only* place we handle output now.
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
