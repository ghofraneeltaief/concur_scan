import React from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { BASE_URL, api_version } from '../../../authentication/config';

class Cible_byAd extends React.Component {
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
        colors: ['#58A9FB', '#ED4B82', '#8a8a8a'],
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
          categories: [],
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
      dataAvailable: true // Flag to track if data is available or not
    };
  }

  componentDidMount() {
    this.fetchData();
  }
  
  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedDetail !== this.props.selectedDetail
    ) {
      this.fetchData();
    }
  }

  async fetchData() {
    const { selectedDetail } = this.props;

    if (selectedDetail) {
      const token = localStorage.getItem('token');
      const responseObject = JSON.parse(token);
      const accessToken = responseObject.access_token;
      const apiUrl = `${BASE_URL}/${api_version}/reports/ad_by_ranges?hp_cs_authorization=${accessToken}&ad_id=${selectedDetail}`;

      try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data.length === 0) { // Check if data is empty
          this.setState({ dataAvailable: false }); // Set flag to false if data is empty
          return;
        }

        // Process the response data to fit the chart series
        const categories = [];
        const maleSeries = [];
        const femaleSeries = [];

        data.forEach(item => {
          categories.push(item.fb_ad_range_label);
          maleSeries.push(parseInt(item.male));
          femaleSeries.push(parseInt(item.female));
        });

        this.setState({
          series: [
            { name: 'Homme', data: maleSeries },
            { name: 'Femme', data: femaleSeries },
          ],
          options: {
            ...this.state.options,
            xaxis: {
              ...this.state.options.xaxis,
              categories: categories
            }
          },
          dataAvailable: true // Set flag to true if data is available
        });
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    }
  }

  render() {
    const { dataAvailable } = this.state;

    return (
      <div>
        {dataAvailable ? (
          <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={320} />
        ) : (
          <div>Aucune cible disponible</div>
        )}
      </div>
    );
  }
}

export default Cible_byAd;
