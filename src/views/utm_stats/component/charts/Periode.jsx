import React from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL, api_version } from '../../../authentication/config';

class Periode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    
      series: [
        // George Washington
        {
          name: 'George Washington',
          data: [
            {
              x: '1',
              y: [
                new Date(1789, 3, 30).getTime(),
                new Date(1797, 2, 4).getTime()
              ]
            },
          ]
        },
        // John Adams
        {
          name: 'John Adams',
          data: [
            {
              x: '1',
              y: [
                new Date(1797, 2, 4).getTime(),
                new Date(1801, 2, 4).getTime()
              ]
            },
          ]
        },
      ],
      options: {
        chart: {
          height: 350,
          type: 'rangeBar'
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '50%',
            rangeBarGroupRows: true
          }
        },
        colors: [
          "#008FFB", "#00E396"
        ],
        fill: {
          type: 'solid'
        },
        xaxis: {
          type: 'datetime',
          show: false
        },
        legend: {
          position: 'right'
        },
        tooltip: {
          custom: function(opts) {
            const fromYear = new Date(opts.y1).getFullYear()
            const toYear = new Date(opts.y2).getFullYear()
        
            const w = opts.ctx.w
            let ylabel = w.globals.labels[opts.dataPointIndex]
            let seriesName = w.config.series[opts.seriesIndex].name
              ? w.config.series[opts.seriesIndex].name
              : ''
            const color = w.globals.colors[opts.seriesIndex]
        
            return (
              '<div class="apexcharts-tooltip-rangebar">' +
              '<div> <span class="series-name" style="color: ' +
              color +
              '">' +
              (seriesName ? seriesName : '') +
              '</span></div>' +
              '<div> <span class="category">' +
              ylabel +
              ' </span> <span class="value start-value">' +
              fromYear +
              '</span> <span class="separator">-</span> <span class="value end-value">' +
              toYear +
              '</span></div>' +
              '</div>'
            )
          }
        }
      },
    
    
    };
  }



  render() {
    return (
      <div>
        <div id="chart">
          <ReactApexChart options={this.state.options} series={this.state.series} type="rangeBar" height={350} />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}

export default Periode;
