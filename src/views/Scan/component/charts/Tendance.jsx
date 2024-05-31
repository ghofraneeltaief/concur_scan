import React from 'react';
import ReactApexChart from 'react-apexcharts';

class Tendance extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: [{
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
        }],
        options: {
          chart: {
            type: 'bar',
          },
          plotOptions: {
            bar: {
              barHeight: '100%',
              distributed: true,
              horizontal: true,
              dataLabels: {
                position: 'bottom'
              },
            }
          },
          colors: ['#5FA7FF', '#F46082', '#70D49A', '#FFCF45', '#1961AA', '#8857EE', '#70D4D4', '#6577F3',
            '#5C5E6D', '#FEA31C'
          ],
          dataLabels: {
            enabled: true,
            textAnchor: 'start',
            style: {
              colors: ['#fff']
            },
            formatter: function (val, opt) {
              return ''
            },
            offsetX: 0,
            dropShadow: {
              enabled: false
            }
          },
          stroke: {
            width: 5,
            colors: ['#fff']
          },
          xaxis: {
            categories: ['Inclusion', 'Diplôme', 'Métier', 'Chômage', 'Passion', 'Salaire', 'Reconversion',
              'Financement', 'Bénéfices', 'Secteur'
            ],
          },
          yaxis: {
            labels: {
              show: true
            }
          },
          tooltip: {
            theme: 'dark',
            x: {
              show: false
            },
          }
        },
      
      
      };
    }

  

    render() {
      return (
        <div>
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={380} />
         
        </div>
      );
    }
  }

export default Tendance;
