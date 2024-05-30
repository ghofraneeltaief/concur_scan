import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, Title } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, Title);

const Placement = () => {
  const data = {
    "auto": {
        "count": 1043,
        "details": []
    },
    "manual": {
        "count": 768,
        "details": [
            {
                "count": "733",
                "publisher_plateforme_label": "facebook"
            },
            {
                "count": "736",
                "publisher_plateforme_label": "instagram"
            },
            {
                "count": "733",
                "publisher_plateforme_label": "audience_network"
            }
        ]
    }
};
    const { auto, manual } = data;
    const autoCount = auto.count;
    const manualCount = manual.count;
    const manualDetailsCounts = manual.details.map(detail => parseInt(detail.count));

    const chartData = {
        labels: ['Auto', 'Instagram', 'Facebook', 'Messenger', 'Autres'],
        datasets: [{
            data: [
                autoCount,
                manualDetailsCounts[1], // Instagram
                manualDetailsCounts[0], // Facebook
                manualDetailsCounts[2], // Messenger
                manualCount - manualDetailsCounts.reduce((a, b) => a + b, 0) // Autres
            ],
            backgroundColor: [
                '#6DD5B3', // Auto
                '#9D81E2', // Instagram
                '#55A9FF', // Facebook
                '#3282CD', // Messenger
                '#205F9E'  // Autres
            ],
            hoverBackgroundColor: [
                '#57C99D', // Auto
                '#8362E3', // Instagram
                '#3B94E8', // Facebook
                '#2768AB', // Messenger
                '#164883'  // Autres
            ]
        }]
    };

    const options = {
        responsive: true,
        cutout: '50%',
        rotation: -90,
        circumference: 180,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                },
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                    }
                }
            }
        }
    };

    return (
        <div>
            <Doughnut data={chartData} options={options} />
        </div>
    );
}

export default Placement;
