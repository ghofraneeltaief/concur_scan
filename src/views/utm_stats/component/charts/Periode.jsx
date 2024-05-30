import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const apiData = [
    { fb_ad_status: "0", hour: "9", total_cover: "1080434" },
    { fb_ad_status: "0", hour: "10", total_cover: "1080434" },
    { fb_ad_status: "0", hour: "11", total_cover: "1080434" },
    { fb_ad_status: "0", hour: "12", total_cover: "1080434" },
    { fb_ad_status: "0", hour: "13", total_cover: "1080434" },
    { fb_ad_status: "0", hour: "14", total_cover: "1080434" },
    { fb_ad_status: "0", hour: "15", total_cover: "1080434" },
    { fb_ad_status: "0", hour: "16", total_cover: "1080434" },
    { fb_ad_status: "0", hour: "17", total_cover: "1080434" },
    { fb_ad_status: "0", hour: "18", total_cover: "1080434" },
    { fb_ad_status: "0", hour: "19", total_cover: "1080434" },
    { fb_ad_status: "0", hour: "20", total_cover: "1080434" },
    { fb_ad_status: "0", hour: "21", total_cover: "1080434" },
    { fb_ad_status: "0", hour: "22", total_cover: "1080434" },
    { fb_ad_status: "0", hour: "23", total_cover: "1080434" },
];

const generateFullHourRange = () => {
    const hours = [];
    for (let i = 7; i <= 23; i++) {
        hours.push(i);
    }
    return hours;
};

const formatData = (data) => {
    const fullHours = generateFullHourRange();
    const formattedData = fullHours.map(hour => {
        const found = data.find(item => parseInt(item.hour) === hour);
        return {
            hour,
            status: found ? 'Active' : 'Inactive'
        };
    });
    return formattedData;
};

const TimelineChart = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        // You would fetch data here, for now we use the static data provided
        const formattedData = formatData(apiData);
        setChartData(formattedData);
    }, []);

    return (
        <ResponsiveContainer width="100%" height={100}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" domain={[7, 23]} ticks={[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]} />
                <YAxis type="category" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="status" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default TimelineChart;
