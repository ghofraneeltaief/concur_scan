import React from 'react';
import ReactApexChart from 'react-apexcharts';


class Cible extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: [{
          name: 'Homme',
          data: [44, 55, 41]
        }, {
          name: 'Femme',
          data: [13, 23, 20]
        }],
        options: {
          chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            stackType: '300%'
          },
          colors: ['#58A9FB', '#ED4B82'],
          responsive: [{
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0
              }
            }
          }],
          xaxis: {
            categories: ['18 - 25', '25 - 45', '45 et +'],
          },
          fill: {
            opacity: 1
          },
        },
      
      
      };
    }

  

    render() {
      return (
        <div>
            <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} />
        </div>
      );
    }
  }


export default Cible;
