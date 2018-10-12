function Process(name, seconds, threads) {
  this.name = name;
  this.duration = seconds;
  this.nextProcess = null;
  this.threads = threads;

  this.line = [];
  this.lineCounts = [];
  this.output = [];
  this.current = new Array(threads);
  this.done = false;

  this.reset = function() {
    this.line = [];
    this.lineCounts = [];
    this.output = [];
    this.current = new Array(threads);
    this.done = false;
  }

  this.setNextProcess = function(n) {
    this.nextProcess = n;
  }

  this.add = function(t) {
    // console.log(`  added customer to ${this.name} line at ${t}`);
    this.line.push({
      start: t,
      end: null,
      wait: 0,
      elapsed: 0,
      done: false
    });
    this.next(t);
  }

  this.second = function(t) {
    this.line.forEach((c) => c.wait++);
    this.current.forEach((c) => {
      if (c) {
        c.elapsed++;
        if (c.elapsed >= this.duration) {
          c.done = true;
          this.next(t, c);
        }
      }
    });
    this.lineCounts.push(this.line.length);
  }

  this.next = function(t) {
    // console.log(this.name, 'next', this.current.length, this.current);
    for (let i=0; i < this.current.length; i++) {
      if (this.current[i] && this.current[i].done) {
        this.current[i].end = t;
        this.output.push(this.current[i]);
        // add customer to next process
        if (this.nextProcess) {
          this.nextProcess.add(t);
        }
        this.current[i] = null;
      }
    }

    for (let i=0; i < this.current.length; i++) {
      if (!this.current[i] || this.current[i].done) {
        if (this.line.length) {
          this.current[i] = this.line.splice(0, 1)[0];
        }
      }
    }

    if (!this.line.length && !this.current.find((c) => c != null)) {
      // console.log(`${this.name} line empty`);
      this.done = true;
    }
    // console.log(this.name, 'after', this.current);
  }
}

module.exports = Process;
