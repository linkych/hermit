document.addEventListener("DOMContentLoaded", function() {
    const cpuCheckbox = document.getElementById('cpu-checkbox');
    const memoryCheckbox = document.getElementById('memory-checkbox');
    const applySettingsButton = document.getElementById('apply-settings');

    const cpuStat = document.getElementById('cpu-stat');
    const memoryStat = document.getElementById('memory-stat');

    const cpuCtx = document.getElementById('cpuChart').getContext('2d');
    const cpuChart = new Chart(cpuCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'CPU Usage (%)',
                data: [],
                backgroundColor: 'rgba(118, 199, 192, 0.2)',
                borderColor: 'rgba(118, 199, 192, 1)',
                borderWidth: 1,
                fill: true,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    function fetchStats() {
        fetch('/api/stats')
            .then(response => response.json())
            .then(data => {
                if (cpuCheckbox.checked) {
                    updateCpuChart(data.cpu_usage);
                }
                if (memoryCheckbox.checked) {
                    updateMemoryUsage(data.memory_usage);
                }
            })
            .catch(error => console.error('Error fetching stats:', error));
    }

    function updateCpuChart(cpuUsage) {
        const now = new Date().toLocaleTimeString();
        if (cpuChart.data.labels.length > 20) {
            cpuChart.data.labels.shift();
            cpuChart.data.datasets[0].data.shift();
        }
        cpuChart.data.labels.push(now);
        cpuChart.data.datasets[0].data.push(cpuUsage);
        cpuChart.update();
    }

    function updateMemoryUsage(memoryUsage) {
        const memoryUsageElement = document.getElementById('memory-usage');
        memoryUsageElement.innerText = (memoryUsage / (1024 * 1024)).toFixed(2) + ' MB';

        const memoryBar = document.getElementById('memory-bar');
        const totalMemory = 16 * 1024 * 1024 * 1024; // Assuming 16GB total memory for simplicity
        const memoryPercentage = (memoryUsage / totalMemory) * 100;
        memoryBar.style.width = memoryPercentage + '%';
    }

    applySettingsButton.addEventListener('click', function() {
        cpuStat.style.display = cpuCheckbox.checked ? 'block' : 'none';
        memoryStat.style.display = memoryCheckbox.checked ? 'block' : 'none';
    });

    setInterval(fetchStats, 5000); // Refresh stats every 5 seconds
    fetchStats(); // Initial fetch
});
