const Process = require('./process');

let Simulator = {};

Simulator.simulateNTimes = function(sys, arrivalsPerHour, n) {
  let results = [];
  for (var i=0; i < n; i++) {
    console.log(`Simulation ${i+1}`);
    results.push(Simulator.simulate(sys, arrivalsPerHour));
  }

  let final = sys.processes.map((p, i) => {
    let totalWait = results.reduce((t, c) => { return t + c[i].wait; }, 0);
    let avgWait = totalWait / results.length;
    let totalLine = results.reduce((t, c) => { return t + c[i].line; }, 0);
    let avgLine = totalLine / results.length;
    console.log(`TOTAL: ${p.name} line: ${avgLine}, wait: ${avgWait}`);
    return {
      wait: avgWait,
      line: avgLine
    }
  });

}

Simulator.simulate = function(system, arrivalsPerHour) {
  system.reset();
  let arrivals = arrivalsPerHour.map((a) => {
    let all = [];
    for (let i=0; i < a; i++) {
      all.push(Math.floor(Math.random() * 60 * 60));
    }
    return all;
  });

  let totalCustomers = 0;
  let hours = arrivals.length;

  let t = 0;
  while (t <= hours * 60 * 60 || !system.done) {
    let h = Math.floor(t / 3600);
    let m = Math.floor((t - h*3600)/60);
    let s = t - h*3600 - m*60;
    system.second(t);
    if (h < arrivals.length) {
      let arrivalsThisSecond = arrivals[h].filter((a) => a == m*60+s);
      arrivalsThisSecond.forEach((a) => {
        totalCustomers++;
        // console.log(`${totalCustomers}: check in (${m*60+s})`);
        system.addCustomer(t);
        // console.log(`  ${firstProcess.line} in line`);
      });
    }
    t++;
  }

  // console.log(system.processes[0].output);
  // console.log(system.processes[1].output);
  // console.log(firstProcess.lineCounts);

  return system.processes.map((p) => {
    // avg wait time
    let totalWait = p.output.reduce((t, current) => {
      return t + current.wait;
    }, 0);
    let avgWait = (totalWait / 60) / p.output.length;

    // avg line length
    let totalLine = p.lineCounts.reduce((t, c) => { return t + c; }, 0);
    let avgLine = totalLine / p.lineCounts.length;

    console.log(`  ${p.name} line: ${avgLine}, wait: ${avgWait}`);
    return {
      wait: avgWait,
      line: avgLine
    }
  });
}

module.exports = Simulator;
