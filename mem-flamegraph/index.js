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

	const appProcess = spawn('node', ['--prof', '--no-logfile-per-isolate', input]);
	appProcess.stdout.pipe(process.stdout);
	appProcess.stderr.pipe(process.stderr);

	process.on('SIGINT', () => {
		appProcess.kill('SIGINT'); // Exit the appProcess without exiting the main Node.js process
	});

	appProcess.on('exit', (code) => {
		const isolateLogPath = `v8.log`;
		const isolateLogContent = fs.readFileSync(isolateLogPath, { encoding: 'utf-8' });
		const app2Process = spawn('node', ['--prof', '--prof-process', '--preprocess', '-j', isolateLogPath, '|', 'flamebearer'],{shell: true});
		app2Process.stdout.pipe(process.stdout);
		app2Process.stderr.pipe(process.stderr);
		app2Process.on('exit', (code2) => {
			console.log('flamegraph created')
			process.exit(code2);
			process.exit(code)
		});

	});
})();
