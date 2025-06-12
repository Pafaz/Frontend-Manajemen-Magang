import ReactApexChart from 'react-apexcharts';

const StatisticsCard = ({ peserta }) => {

  const activeData = peserta || [];

  const options = {
    chart: {
      type: 'bar',
      height: '100%',
      toolbar: { show: false },
      fontFamily: 'Poppins, Arial, sans-serif',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
        columnWidth: '20%',
        endingShape: 'rounded',
        distributed: false,
      },
    },
    dataLabels: {
      enabled: false, // Matikan data labels (angka)
    },
    xaxis: {
      categories: activeData.map(item => item.nama_divisi),
      labels: { style: { fontSize: '10px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: '' },
      max: 500,
      tickAmount: 5,
      labels: {
        formatter: function(val) { return val.toLocaleString(); },
        style: { fontSize: '10px' },
      },
    },
    fill: {
      opacity: 1,
      colors: ['#3A5987'],
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      y: { formatter: function(val) { return val.toLocaleString() + ' Peserta'; } }
    },
    states: {
      hover: {
        filter: { type: 'darken', value: 0.9 },
      }
    },
  };

  const series = [{
    name: 'Peserta',
    data: activeData.map(item => item.total_peserta),
  }];

  return (
    <div className="bg-white-200 bg-white border border-slate-400/[0.5] rounded-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Peserta Per Divisi</h2>
      </div>
      
      <div className="relative h-64">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height="100%"
        />
      </div>
    </div>
  );
};

export default StatisticsCard;
