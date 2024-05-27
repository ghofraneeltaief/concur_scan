import React from 'react';
import ReactApexChart from 'react-apexcharts';


class Periode extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: [{
          name: 'Marine Sprite',
          data: [44, 55, 41, 37, 22, 43, 21]
        }],
        options: {
          chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            stackType: '100%'
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          stroke: {
            width: 1,
            colors: ['#fff']
          },
          title: {
            text: '100% Stacked Bar'
          },
          xaxis: {
            categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val + "K"
              }
            }
          },
          fill: {
            opacity: 1
          
          },
          legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
          }
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


export default Periode;
