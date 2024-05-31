import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Chart, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { BASE_URL, api_version } from '../../../authentication/config';

Chart.register(ArcElement, Tooltip, Legend, Title);

class Placement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalChartData: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: ['#6DD5B3', '#9D81E2'],
                    hoverBackgroundColor: ['#57C99D', '#8362E3']
                }]
            },
            manualChartData: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: ['#55A9FF', '#3282CD', '#205F9E'],
                    hoverBackgroundColor: ['#3B94E8', '#2768AB', '#164883']
                }]
            },
            options: {
                responsive: true,
                cutout: '50%',
                rotation: -90,
                circumference: 180,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                        },
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw}`;
                            }
                        }
                    }
                }
            }
        };

        this.handleError = this.handleError.bind(this);
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

    handleError(error) {
        Swal.fire({
            icon: 'info',
            text: error,
            width: '30%',
            confirmButtonText: "Ok, j'ai compris!",
            confirmButtonColor: '#0095E8',
        });
    }

    async fetchData() {
        const { selectedVerticalId, selectedDateFrom, selectedDateTo, selectedPage } = this.props;

        if (selectedVerticalId && selectedDateFrom && selectedDateTo && selectedPage) {
            const token = localStorage.getItem('token');
            const responseObject = JSON.parse(token);
            const accessToken = responseObject.access_token;
            const apiUrl = `${BASE_URL}/${api_version}/reports/ads_stats_by_publisher_plateforme?hp_cs_authorization=${accessToken}&date_begin=${selectedDateFrom}&date_end=${selectedDateTo}&vertical_id=${selectedVerticalId}&page_id=${selectedPage}`;

            try {
                const response = await axios.get(apiUrl);
                const data = response.data;

                if (response.status === 404) {
                    this.handleError('Aucune donnée trouvée !');
                    return;
                }

                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }

                // Traiter les données pour les graphiques
                const autoCount = data.auto.count;
                const manualCount = data.manual.count;
                const manualDetailsCounts = data.manual.details.map(detail => parseInt(detail.count));
                const manualLabels = data.manual.details.map(detail => detail.publisher_plateforme_label);

                this.setState({
                    totalChartData: {
                        labels: ['Auto', 'Manual'],
                        datasets: [{
                            data: [autoCount, manualCount],
                            backgroundColor: ['#6DD5B3', '#9D81E2'],
                            hoverBackgroundColor: ['#57C99D', '#8362E3']
                        }]
                    },
                    manualChartData: {
                        labels: manualLabels,
                        datasets: [{
                            data: manualDetailsCounts,
                            backgroundColor: ['#55A9FF', '#3282CD', '#205F9E'],
                            hoverBackgroundColor: ['#3B94E8', '#2768AB', '#164883']
                        }]
                    }
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
                <div>
                    <h2>Total Count</h2>
                    <Doughnut data={this.state.totalChartData} options={this.state.options} />
                </div>
                <div>
                    <h2>Manual Publisher Platform Labels</h2>
                    <Doughnut data={this.state.manualChartData} options={this.state.options} />
                </div>
            </div>
        );
    }
}

export default Placement;
