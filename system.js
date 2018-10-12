module.exports = function System() {
  this.processes = [];
  this.done = false;

  this.reset = function() {
    this.processes.forEach((p) => {
      p.reset();
    });
    this.done = false;
  }

  this.addProcess = function(p) {
    let prevProcess;
    if (this.processes.length) {
      prevProcess = this.processes[this.processes.length - 1];
    }
    this.processes.push(p);
    if (prevProcess) {
      prevProcess.setNextProcess(p);
    }
  }

  this.getFirstProcess = function() {
    return this.processes.length ? this.processes[0] : null;
  }

  this.second = function(t) {
    let done = true;
    this.processes.forEach((p) => {
      p.second(t);
      if (!p.done) {
        done = false;
      }
    });
    if (done) {
      this.done = true;
    }
  }

  this.addCustomer = function(t) {
    let first = this.getFirstProcess();
    if (first) {
      first.add(t);
    }
  }
}
