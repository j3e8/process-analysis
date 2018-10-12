const System = require('./system');
const Process = require('./process');
const Simulator = require('./simulator');

let system = new System();
let checkIn = new Process('check in', 2.5*60, 1);
system.addProcess(checkIn);
let xray = new Process('x-ray', 8*60, 3);
system.addProcess(xray);
let arrivalsPerHour = [ 17, 31, 20, 15 ];

// let system = new System();
// let checkIn = new Process('ID check', 15, 3);
// system.addProcess(checkIn);
// let xray = new Process('x-ray', 30, 5);
// system.addProcess(xray);
// let arrivalsPerHour = [ 780, 570, 320 ];


let iterations = process.argv.length > 2 ? parseInt(process.argv[2]) || 1 : 1;

Simulator.simulateNTimes(system, arrivalsPerHour, iterations);
