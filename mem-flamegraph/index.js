#!/usr/bin/env node

/**
 * mem-flamegraph
 * memory flamegraphs
 *
 * @author Gourav <https://gourav2000.github.io/MyPortfolio/>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const { spawn } = require('child_process');
const fs = require('fs');



const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	debug && log(flags);

	const appProcess  = spawn('node', ['--prof', input]);
	appProcess.stdout.pipe(process.stdout);
  	appProcess.stderr.pipe(process.stderr);
	
	// Capture garbage collection logs to a file
	const gcLog = fs.createWriteStream('gc.log');
	appProcess.stdout.pipe(gcLog);
  
	appProcess.on('exit', (code) => {
		process.exit(code);
	});
})();
