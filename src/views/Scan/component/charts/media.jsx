import React from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { BASE_URL, api_version } from '../../../authentication/config'; 

class Media extends React.Component {
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
        labels: [],
        colors: ['#f1c40f', '#2ecc71', '#6577F3'],
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
        }],
        showChart: true,
      }
    };
  }

  componentDidMount() {
    this.fetchData();
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.selectedVerticalId !== prevProps.selectedVerticalId ||
        this.props.selectedDateFrom !== prevProps.selectedDateFrom ||
        this.props.selectedDateTo !== prevProps.selectedDateTo ||
        this.props.selectedPage !== prevProps.selectedPage) {
      this.fetchData();
    }
  }

  async fetchData() {
    const { selectedVerticalId, selectedDateFrom, selectedDateTo, selectedPage } = this.props;

    if (!selectedVerticalId || !selectedDateFrom || !selectedDateTo || !selectedPage) {
      return;
    }

    const token = localStorage.getItem('token');
    const responseObject = JSON.parse(token);
    const accessToken = responseObject.access_token;
    const apiUrl = `${BASE_URL}/${api_version}/reports/ads_stats_by_medias_type?hp_cs_authorization=${accessToken}&date_begin=${selectedDateFrom}&date_end=${selectedDateTo}&vertical_id=${selectedVerticalId}&page_id=${selectedPage}`;

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (response.status === 404 || !data || data.length === 0 || Object.values(data).every(value => value === 0)) {
        this.setState({ showChart: false });
        return;
      }

      this.setState({
        series: Object.values(data),
        options: {
          ...this.state.options,
          labels: Object.keys(data),
        },
        showChart: true,
      });
    } catch (error) {
      console.error("Error fetching media data:", error);
      this.setState({ showChart: false });
    }
  }

  render() {
    return (
      <div>
        {this.state.showChart ? (
          <ReactApexChart options={this.state.options} series={this.state.series} type="donut" height={350} />
        ) : (
          <div>Aucune Média fondée</div>
        )}
      </div>
    );
  }
}

export default Media;
