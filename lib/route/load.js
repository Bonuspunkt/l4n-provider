const os = require('os');

const cpuUsage = () =>
    os.cpus()
        .map(cpu => ({
            idle: cpu.times.idle,
            total: Object.keys(cpu.times)
                .map(time => cpu.times[time])
                .reduce((p,c) => p + c, 0)
        }))
        .map(cpu => 1 - cpu.idle / cpu.total);

module.exports = (req, res) => {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(cpuUsage()));
};
