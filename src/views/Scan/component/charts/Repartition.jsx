import React from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL, api_version } from '../../../authentication/config';

class Repartition extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [],
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
        labels: [], // Labels will be updated dynamically
        colors: ['#f1c40f', '#2ecc71'], // Custom colors for geolocation and carpet bombing
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
      showChart: true,
    };

  }

  componentDidMount() {
    this.fetchData();
  }
  
  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedVerticalId !== this.props.selectedVerticalId ||
      prevProps.selectedDateFrom !== this.props.selectedDateFrom ||
      prevProps.selectedDateTo !== this.props.selectedDateTo ||
      prevProps.selectedPage !== this.props.selectedPage
    ) {
      this.fetchData();
    }
  }

  async fetchData() {
    const { selectedVerticalId, selectedDateFrom, selectedDateTo, selectedPage } = this.props;

    if (selectedVerticalId && selectedDateFrom && selectedDateTo && selectedPage) {
      const token = localStorage.getItem('token');
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const apiUrl = `${BASE_URL}/${api_version}/reports/ads_stats_by_geolocation_type?hp_cs_authorization=${accessToken}&date_begin=${selectedDateFrom}&date_end=${selectedDateTo}&vertical_id=${selectedVerticalId}&page_id=${selectedPage}`;

      try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (response.status === 404 || !data || Object.values(data).every(val => val === 0)) {
          this.setState({ showChart: false });
          return;
        }

        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }

        // Extract labels and series from API response
        const labels = Object.keys(data);
        const series = Object.values(data).map(value => parseInt(value));

        this.setState({
          series: series,
          options: {
            ...this.state.options,
            labels: labels,
          },
          showChart: true,
        });
      } catch (error) {
        console.error("There was an error fetching the data!", error);
        this.setState({ showChart: false });
      }
    }
  }

  render() {
    return (
      <div>
        {this.state.showChart ? (
          <ReactApexChart options={this.state.options} series={this.state.series} type="donut" height={350} />
        ) : (
          <div>Aucune Répartition Géolocalisation fondée</div>
        )}
      </div>
    );
  }
}

export default Repartition;
