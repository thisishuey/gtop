const blessed = require("blessed");
const contrib = require("blessed-contrib");
const monitor = require("./monitor");

const screen = blessed.screen();
let grid = new contrib.grid({
  rows: 6,
  cols: 3,
  screen: screen
});

const cpuLine = grid.set(0, 0, 2, 3, contrib.line, {
  showNthLabel: 5,
  maxY: 100,
  label: "CPU History",
  showLegend: true
});

const memLine = grid.set(2, 0, 2.125, 2, contrib.line, {
  showNthLabel: 5,
  maxY: 100,
  label: "Memory and Swap History",
  showLegend: true,
  legend: {
    width: 10
  }
});

const procTable = grid.set(2, 2, 4, 1.025, contrib.table, {
  keys: true,
  vi: true,
  label: "Processes",
  columnSpacing: 1,
  columnWidth: [7, 24, 7, 7],
  selectedFg: "black"
});

const netSpark = grid.set(4, 0, 1, 1, contrib.sparkline, {
  label: "Network History",
  tags: true,
  style: {
    fg: "blue"
  }
});

const diskDonut = grid.set(5, 0, 1, 1, contrib.donut, {
  radius: 8,
  arcWidth: 3,
  yPadding: 2,
  remainColor: "black",
  label: "Disk usage"
});

const memDonut = grid.set(4, 1, 1, 1, contrib.donut, {
  radius: 8,
  arcWidth: 3,
  yPadding: 2,
  remainColor: "black",
  label: "Memory"
});

const swapDonut = grid.set(5, 1, 1, 1, contrib.donut, {
  radius: 8,
  arcWidth: 3,
  yPadding: 2,
  remainColor: "black",
  label: "Swap"
});

procTable.focus();

screen.render();
screen.on("resize", function() {
  cpuLine.emit("attach");
  memLine.emit("attach");
  memDonut.emit("attach");
  swapDonut.emit("attach");
  netSpark.emit("attach");
  diskDonut.emit("attach");
  procTable.emit("attach");
});

screen.key(["escape", "q", "C-c"], function() {
  return process.exit(0);
});

function init() {
  new monitor.Cpu(cpuLine); //no Windows support
  new monitor.Mem(memLine, memDonut, swapDonut);
  new monitor.Net(netSpark);
  new monitor.Disk(diskDonut);
  new monitor.Proc(procTable); // no Windows support
}

process.on("uncaughtException", function() {
  // avoid exiting due to unsupported system resources in Windows
});

module.exports = {
  init: init,
  monitor: monitor
};
