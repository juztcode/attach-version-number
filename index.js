const fs = require('fs')
const core = require('@actions/core');

function generateSemver(branchDiffFile, previousVersion) {
  const data = fs.readFileSync(branchDiffFile, 'utf8');
  const lines = data.split(/\r?\n/);
  console.log("Lines: " + lines.length);

  const p = previousVersion.split(".");
  const major = +p[0];
  let minor = +p[1];
  let patch = +p[2];
  const suffix = p[3];

  patch++;
  for (const line of lines) {
    if (line.includes('[FEATURE]')) {
      minor++;
      patch = 0;
      break;
    }
  }

  return `${major}.${minor}.${patch}.${suffix}`;
}

async function run() {
  try {
    const branchDiffFile = core.getInput('branch-diff-file', {required: true});
    const previousVersion = core.getInput('previous-version', {required: true});
    const generatedVersion = generateSemver(branchDiffFile, previousVersion);

    core.setOutput("generated-version", generatedVersion);
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
