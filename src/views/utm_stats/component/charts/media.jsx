import React from 'react';
import ReactApexChart from 'react-apexcharts';

class Media extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [44, 55, 41], // Adjust series to match the example
      options: {
        chart: {
          type: 'donut',
          background: '#ffffff',
          foreColor: '#333',
        },
        plotOptions: {
          pie: {
            donut: {
              size: '65%',
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val.toFixed(2) + "%";
          }
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
          show: true,
        },
        labels: ['Image', 'Vidéo', 'Caroussel'], // Add labels
        colors: ['#f1c40f', '#2ecc71', '#3498db'], // Add custom colors
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
    };
  }

  render() {
    return (
      <div>
        <ReactApexChart options={this.state.options} series={this.state.series} type="donut" height={350} />
      </div>
    );
  }
}

export default Media;
