const blessed = require("blessed");
const contrib = require("blessed-contrib");
const monitor = require("./monitor");

const screen = blessed.screen();
let grid = new contrib.grid({
  rows: 18,
  cols: 18,
  screen: screen
});

const cpuLine = grid.set(0, 0, 6, 18, contrib.line, {
  showNthLabel: 5,
  maxY: 100,
  label: "CPU History",
  showLegend: true
});

const memLine = grid.set(6, 0, 6, 12, contrib.line, {
  showNthLabel: 5,
  maxY: 100,
  label: "Memory and Swap History",
  showLegend: true,
  legend: {
    width: 10
  }
});

const procTable = grid.set(6, 12, 12, 6.125, contrib.table, {
  keys: true,
  vi: true,
  label: "Processes",
  columnSpacing: 1,
  columnWidth: [7, 24, 7, 7]
});

const netSpark = grid.set(11.75, 0, 3.25, 6, contrib.sparkline, {
  label: "Network History",
  tags: true,
  style: {
    fg: "blue"
  }
});

const diskDonut = grid.set(15, 0, 3, 6, contrib.donut, {
  radius: 8,
  arcWidth: 3,
  yPadding: 2,
  remainColor: "black",
  label: "Disk usage"
});

const memDonut = grid.set(11.75, 6, 3.25, 6, contrib.donut, {
  radius: 8,
  arcWidth: 3,
  yPadding: 2,
  remainColor: "black",
  label: "Memory"
});

const swapDonut = grid.set(15, 6, 3, 6, contrib.donut, {
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
