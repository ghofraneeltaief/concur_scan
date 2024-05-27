import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

const data = [
  { name: 'Auto', value: 100, fill: '#4caf50' },
  { name: 'Manuel', value: 50, fill: '#7986cb' },
  { name: 'Instagram', value: 20, fill: '#90caf9' },
  { name: 'Facebook', value: 15, fill: '#2196f3' },
  { name: 'Autres', value: 5, fill: '#0d47a1' },
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${data[index].name}`}
    </text>
  );
};

const Container = styled.div`
  width: 100%;
  text-align: center;
  font-family: Arial, sans-serif;
`;

const SemiDonutChart = () => {
  return (
    <Container>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius="50%"
            outerRadius="80%"
            fill="#8884d8"
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default SemiDonutChart;
