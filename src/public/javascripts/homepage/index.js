var config = {
    type: 'line',
    data: {
        labels: ['CNPM', 'HTTT', 'KHMT', 'KTMT', 'TT&MTT', 'ATTT'],
        datasets: [{
                label: 'Tất cả',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: [
                    80,
                    60,
                    50,
                    20,
                    40,
                    20
                ],
                fill: false,
            },
            {
                label: 'Năm nay',
                backgroundColor: window.chartColors.green,
                borderColor: window.chartColors.green,
                data: [
                    8,
                    6,
                    5,
                    2,
                    4,
                    2
                ],
                fill: false,
            }
        ]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Số lượng đồ án theo các viện'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Khoa'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Số lượng'
                }
            }]
        }
    }
};

var barChartData = {
    labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    datasets: [{
        label: 'Phổ điểm',
        backgroundColor: window.chartColors.yellow,
        borderColor: window.chartColors.yellow,
        borderWidth: 1,
        data: [
            8,
            6,
            7,
            9,
            6,
            2,
            6
        ]
    }]
};

var radarData = {
    labels: ['CNPM', 'HTTT', 'KHMT', 'KTMT', 'TT&MTT', 'ATTT'],
    datasets: [{
        label: 'Phổ điểm',
        backgroundColor: 'rgb(54, 162, 235, 0.5)',
        borderColor: window.chartColors.blue,
        borderWidth: 1,
        data: [
            8,
            6,
            7,
            9,
            6,
            2,
            6
        ]
    }]
};

window.onload = function() {
    var line = document.getElementById('line').getContext('2d');
    window.myLine = new Chart(line, config);
    var bar = document.getElementById('bar').getContext('2d');
    window.myBar = new Chart(bar, {
        type: 'bar',
        data: barChartData,
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Phổ điểm của sinh viên'
            }
        }
    });
    var radar = document.getElementById('radar').getContext('2d');
    window.radar = new Chart(radar, {
        type: 'radar',
        data: radarData,
        options: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Phổ điểm theo viện'
            },
            scale: {
                ticks: {
                    beginAtZero: true
                }
            }
        }
    });
};
var colorNames = Object.keys(window.chartColors);