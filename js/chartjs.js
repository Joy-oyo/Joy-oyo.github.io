document.addEventListener('DOMContentLoaded', function() {
    const ctx1 = document.getElementById('chart1').getContext('2d');
    const ctx2 = document.getElementById('chart2').getContext('2d');
  
const data1 = {
    labels: ['iced coffee', 'diet coke', 'sprite', 'dr.pepper', 'milk tea', 'orange juice'],
    datasets: [{
    title: 'Votes for favorite soft drinks',
    label: 'Votes',
    data: [12, 19, 3, 5, 2, 3],
    backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)'
    ],
    borderWidth: 1
    }]
};
  
const config1 = {
    type: 'bar',
    data: data1,
    options: {
        responsive:true,
    plugins:{
        legend:{
            position: 'top',
        }
    },
    title:{
        display: true,
        text:'Votes for favorite beverge'
    },
    scales: {
    y: {
    beginAtZero: true
    }
    }
    }
};
  
const data2 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{
    label: 'Sales',
    data: [65, 59, 80, 81, 56, 55],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
}]
};
  
const config2 = {
    type: 'line',
    data: data2
};
  
const chart1 = new Chart(ctx1, config1);
const chart2 = new Chart(ctx2, config2);
});