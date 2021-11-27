const ctx = document.getElementById('myChart').getContext('2d');
let myChart;

const userInput = document.querySelector("#query-form");
const startDateBtn = document.querySelector("#start-date");
const endDateBtn = document.querySelector("#end-date");
const currencyBtn = document.querySelector("#currency");
const minValue = document.querySelector("#min-value");
const maxValue = document.querySelector("#max-value");


// update chart on form change
userInput.onchange = function() {
  let startDate = "";
  let endDate = "";

  if (startDateBtn.value) {
    startDate = "&start=" + startDateBtn.value;
  }

  if (endDateBtn.value) {
    endDate = "&end=" + endDateBtn.value;
  }

  getFinancialData("currency=" + currencyBtn.value, startDate, endDate);
}

function getFinancialData(currency="", startDate="", endDate="") {
  axios
    .get(`http://api.coindesk.com/v1/bpi/historical/close.json?${currency}${startDate}${endDate}`)
    .then(function(dataFromAPI) {
      console.log("data: ", dataFromAPI);

      // display chart
      const labels = Object.keys(dataFromAPI.data.bpi);
      const data = Object.values(dataFromAPI.data.bpi);
      displayChart(labels, data);

      // display min and max values
      minValue.textContent = Math.min(...data) + " " + currency;
      maxValue.textContent = Math.max(...data) + " " + currency;
    })
    .catch(err => console.log(err))
}

function displayChart(labels, data) {
  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels,
        datasets: [{
            label: 'Bitcoin Price Index',
            data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
  });
}