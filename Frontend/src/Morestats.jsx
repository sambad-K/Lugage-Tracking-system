import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';


Chart.register(ChartDataLabels);

const Morestats = () => {
  const airlines = ['Buddha', 'Yeti', 'Shree', 'Quatar'];

  const [data, setData] = useState({
    labels: ['Non misplaced luggage'],
    datasets: [{
      data: [100],
      backgroundColor: ['#28a745'],
      borderWidth: 0,
    }]
  });

  const [counts, setCounts] = useState({
    posts: 0,
    reports: 0,
    nonMisplacedLuggage: 100,
  });

  const initializeBarData = () => ({
    labels: airlines,
    datasets: [{
      label: '',
      data: new Array(airlines.length).fill(0),
      backgroundColor: '',
      borderWidth: 1,
      barThickness: 40, 
    }]
  });

  const [reportLostData, setReportLostData] = useState(initializeBarData());
  const [reportFoundData, setReportFoundData] = useState(initializeBarData());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const distributedsRes = await fetch('http://localhost:5001/distributeds/count');
        const reportFoundRes = await fetch('http://localhost:5001/reportfound/count');
        const reportLostRes = await fetch('http://localhost:5001/reportlost/count');
        const barPostRes = await fetch('http://localhost:5001/barpost/airline-data');
        const barLostRes = await fetch('http://localhost:5001/barlost/airline-data');

        const distributedsData = await distributedsRes.json();
        const reportFoundData = await reportFoundRes.json();
        const reportLostData = await reportLostRes.json();
        const barPostData = await barPostRes.json();
        const barLostData = await barLostRes.json();

        const distributeds = distributedsData.total;
        const reportFound = reportFoundData.total || 0;
        const reportLost = reportLostData.total || 0;
        const nonMisplacedLuggage = distributeds - (reportFound + reportLost);

        let chartData;
        if (reportFound === 0 && reportLost === 0) {
          chartData = {
            labels: ['Non misplaced luggage'],
            datasets: [{
              data: [100],
              backgroundColor: ['#28a745'],
              borderWidth: 0,
            }]
          };
          setCounts({
            posts: 0,
            reports: 0,
            nonMisplacedLuggage: distributeds,
          });
        } else {
          const labels = [];
          const dataValues = [];
          const backgroundColors = [];

          if (reportFound > 0) {
            labels.push('Posts');
            dataValues.push(reportFound);
            backgroundColors.push('#007bff');
          }
          if (reportLost > 0) {
            labels.push('Reports');
            dataValues.push(reportLost);
            backgroundColors.push('#ffcc00');
          }
          if (nonMisplacedLuggage > 0) {
            labels.push('Non misplaced luggage');
            dataValues.push(nonMisplacedLuggage);
            backgroundColors.push('#28a745');
          }

          chartData = {
            labels: labels,
            datasets: [{
              data: dataValues,
              backgroundColor: backgroundColors,
              borderWidth: 0,
            }]
          };

          setCounts({
            posts: reportFound,
            reports: reportLost,
            nonMisplacedLuggage: nonMisplacedLuggage,
          });
        }

        setData(chartData);

        const updateBarData = (barData, label, color) => {
          const dataMap = Object.fromEntries(barData.map(item => [item._id, item.count]));
          const formattedData = airlines.map(airline => dataMap[airline] || 0);
          return {
            labels: airlines,
            datasets: [{
              label,
              data: formattedData,
              backgroundColor: color,
              borderWidth: 1,
              barThickness: 100, 
            }]
          };
        };

        setReportLostData(updateBarData(barLostData, 'Lost Luggage by Airline', '#ffcc00'));
        setReportFoundData(updateBarData(barPostData, 'Found Luggage by Airline', '#007bff'));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const options = {
    plugins: {
      datalabels: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ padding: '20px', marginTop: '40px', backgroundColor: '#f7f7f7', borderRadius: '8px' }}>
      <h2>More Statistics</h2>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <span style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '20px' }}>Posts: {counts.posts}</span>
        <span style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '20px' }}>Reports: {counts.reports}</span>
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Non misplaced luggage: {counts.nonMisplacedLuggage}</span>
      </div>
      <div style={{ maxWidth: '1000px', height: '500px', margin: '0 auto', marginRight: '50px' }}>
        <Pie data={data} options={options} />
      </div>
      <div style={{ marginTop: '40px' }}>
        <h3>Airline Data On The Pending Reports</h3>
        <div style={{ maxWidth: '1000px', height: '500px', margin: '0 auto', marginTop: '20px' }}>
          <Bar data={reportLostData} options={barOptions} />
        </div>
      </div>
      <div style={{ marginTop: '40px' }}>
        <h3>Airline Data On The Active Posts</h3>
        <div style={{ maxWidth: '1000px', height: '500px', margin: '0 auto', marginTop: '20px' }}>
          <Bar data={reportFoundData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default Morestats;
