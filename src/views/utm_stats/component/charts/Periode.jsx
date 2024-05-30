import React from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL, api_version } from '../../../authentication/config';

class Periode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [],
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
        xaxis: {
          categories: [],
          show: false
        },
        yaxis: {
          categories: [],
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val ;
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

    // Bind the context of handleError to the component
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }
  
  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedDetail !== this.props.selectedDetail ||
      prevProps.selectedDateFrom !== this.props.selectedDateFrom
    ) {
      this.fetchData();
    }
  }

  handleError(error) {
    Swal.fire({
      icon: 'error',
      text: error,
      width: '30%',
      confirmButtonText: "Ok, j'ai compris!",
      confirmButtonColor: '#0095E8',
    });
  }

  async fetchData() {
    const { selectedDetail, selectedDateFrom } = this.props;

    if (selectedDetail && selectedDateFrom) {
      const token = localStorage.getItem('token');
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const url = `${BASE_URL}/${api_version}/reports/ad_status?hp_cs_authorization=${accessToken}&date=${selectedDateFrom}&ad_id=${selectedDetail}`;

      try {
        const response = await axios.get(url);
        const data = response.data;
        
        if (response.status === 404) {
          this.handleError('Aucune donnée trouvée !');
          return;
        }

        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        
        const categories = [];
        const seriesData = [];

        data.forEach(item => {
          categories.push(item.hour + 'h');
          seriesData.push(parseInt(item.total_cover));
        });

        this.setState({
          options: {
            ...this.state.options,
            xaxis: {
              ...this.state.options.xaxis,
              categories: categories
            }
          },
          series: [{
            name: 'Total Cover',
            data: seriesData
          }]
        });
      } catch (error) {
        console.error("There was an error fetching the data!", error);
        this.handleError('Aucune donnée trouvée !');
      }
    }
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
