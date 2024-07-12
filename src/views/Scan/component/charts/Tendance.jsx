import React from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { BASE_URL, api_version } from '../../../authentication/config';

class Tendance extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [{ data: [] }],
      options: {
        chart: {
          type: 'bar',
          events: {
            click: (event, chartContext, config) => {
              const clickedIndex = config.dataPointIndex;
              const clickedCategory = this.state.options.xaxis.categories[clickedIndex];
              const clickedAngleId = this.state.angleIds[clickedIndex];  // Updated line
              this.handleBarClick(clickedCategory, clickedAngleId);
            }
          }
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
        colors: ['#5FA7FF', '#F46082', '#70D49A', '#FFCF45', '#1961AA', '#8857EE', '#70D4D4', '#6577F3', '#5C5E6D', '#FEA31C'],
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['#fff']
          },
          formatter: function (val, opt) {
            return val;
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
          categories: [],
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
      angleIds: [],  // Added line
      showChart: true,
      clickedCategoryData: null
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
    const apiUrl = `${BASE_URL}/${api_version}/reports/ads_stats_by_angles?hp_cs_authorization=${accessToken}&date_begin=${selectedDateFrom}&date_end=${selectedDateTo}&vertical_id=${selectedVerticalId}&page_id=${selectedPage}`;

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (response.status === 404 || !data || data.length === 0 || Object.values(data).every(value => value === 0)) {
        this.setState({ showChart: false });
        return;
      }

      const seriesData = data.map(item => parseInt(item.count, 10));
      const categories = data.map(item => item.angle_label || 'Null');
      const angleIds = data.map(item => item.fk_angle_id);  // Updated line

      this.setState({
        series: [{ name: 'ads', data: seriesData }],
        options: {
          ...this.state.options,
          xaxis: {
            categories: categories,
          }
        },
        angleIds: angleIds,  // Updated line
        showChart: true,
      });
    } catch (error) {
      console.error("Error fetching trend data:", error);
      this.setState({ showChart: false });
    }
  }

  handleBarClick(category, angleId) {
    this.props.onBarClick(category, angleId);
  }

  render() {
    return (
      <div>
        {this.state.showChart ? (
          <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={380} />
        ) : (
          <div>Aucune Tendance fondée</div>
        )}
      </div>
    );
  }
}

export default Tendance;
