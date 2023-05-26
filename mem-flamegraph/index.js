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
	process.env['NODE_INSPECT_RESUME_ON_START'] = 1
	const appProcess = spawn('node', ['inspect', input]);

	appProcess.stdin.write('profile');

	appProcess.stdout.on('data', (data) => {
		console.log(`Child process output: ${data}`);
	});

	appProcess.on('error', (err) => {
		console.error(`Error occurred: ${err}`);
	});

	process.on('SIGINT', async () => {
		// appProcess.kill('SIGINT'); // Exit the appProcess without exiting the main Node.js process
		appProcess.stdin.write('profileEnd')
		await appProcess.stdin.write(`profiles[n].save(filepath = 'node.cpuprofile')`)
		await appProcess.stdin.write('.exit')
	});

	appProcess.on('exit', async (code) => {
		const app2Process = spawn('speedscope', ['node.cpuprofile']);
		app2Process.on('exit', (code2) => {
			console.log('flamegraph created')
			process.exit(code2);
			process.exit(code)
		});

		app2Process.on('error', (err) => {
			console.error(`Error occurred: ${err}`);
		});

	});
})();
