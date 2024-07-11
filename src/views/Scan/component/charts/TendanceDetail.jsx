// src/components/TendanceDetail/TendanceDetail.js

import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { BASE_URL, api_version } from '../../../authentication/config';

class TendanceDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [{ data: [] }],
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
      showChart: true,
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedCategory !== prevProps.selectedCategory ||
        this.props.selectedVerticalId !== prevProps.selectedVerticalId ||
        this.props.selectedDateFrom !== prevProps.selectedDateFrom ||
        this.props.selectedDateTo !== prevProps.selectedDateTo ||
        this.props.selectedPage !== prevProps.selectedPage) {
      this.fetchData();
    }
  }

  async fetchData() {
    const { selectedVerticalId, selectedDateFrom, selectedDateTo, selectedPage } = this.props;

    if ( !selectedVerticalId || !selectedDateFrom || !selectedDateTo || !selectedPage) {
      return;
    }

    const token = localStorage.getItem('token');
    const responseObject = JSON.parse(token);
    const accessToken = responseObject.access_token;
    const apiUrl = `${BASE_URL}/${api_version}/reports/ads_stats_by_keywords?hp_cs_authorization=${accessToken}&date_begin=${selectedDateFrom}&date_end=${selectedDateTo}&vertical_id=${selectedVerticalId}&page_id=${selectedPage}`;

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (response.status === 404 || !data || data.length === 0 || Object.values(data).every(value => value === 0)) {
        this.setState({ showChart: false, loading: false });
        return;
      }

      const seriesData = data.map(item => parseInt(item.count, 10));
      const categories = data.map(item => item.keyword_label || 'Null');

      this.setState({
        series: [{ name: 'ads', data: seriesData }],
        options: {
          ...this.state.options,
          xaxis: {
            categories: categories,
          }
        },
        showChart: true,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching trend detail data:", error);
      this.setState({ showChart: false, loading: false });
    }
  }

  render() {
    const { showChart } = this.state;

    return (
      <div>
        {showChart ? (
          <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={380} />
        ) : (
          <div>Aucune Tendance fondée</div>
        )}
      </div>
    );
  }
}

export default TendanceDetail;
