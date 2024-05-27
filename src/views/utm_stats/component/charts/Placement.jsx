import React from 'react';
import ReactApexChart from 'react-apexcharts';


class Placement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [50, 20, 15, 50, 10, 5],
      options: {
        chart: {
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 180,
            hollow: {
              margin: 1,
              size: '1%',
              background: 'transparent',
              image: undefined,
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                show: false,
              }
            },
            barLabels: {
              enabled: true,
              useSeriesColors: true,
              margin: 8,
              fontSize: '14px',
              formatter: function(seriesName, opts) {
                return seriesName + "  " + opts.w.globals.series[opts.seriesIndex]+"%"
              },
            },
          }
        },
        colors: ['#70D49A', '#ABD4FD', '#1183F7', '#6577F3', '#1961AA', '#073462'],
        labels: ['Auto','Instagram', 'Facebook', 'Manuel', 'Messenger', 'Autres'],
        responsive: [{
          breakpoint: 400,
          options: {
            legend: {
                show: true
            }
          }
        }]
      },
    };
  }

  render() {
    return (
      <div>
          <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={390} />
      </div>
    );
  }
}

export default Placement;
