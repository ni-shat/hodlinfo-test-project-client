
document.addEventListener('DOMContentLoaded', () => {
    const exchangeSelect = document.getElementById('supportedExchanges1');
    const dynamicTextDiv = document.getElementById('dynamicText');
    const bitNameSpan = document.getElementById('BitName');

    exchangeSelect.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        dynamicTextDiv.textContent = 'BUY ' + selectedValue; 
        bitNameSpan.textContent = selectedValue + '/INR'; 
    });

    // Initialize dynamic text based on the default selected value
    dynamicTextDiv.textContent = 'BUY ' + exchangeSelect.value;
    bitNameSpan.textContent = exchangeSelect.value + '/INR';
});




function navigateTo(route) {
    history.pushState(null, '', `/${route}`);
    loadPage(route);
}

function loadPage(route) {
    const pageContent = document.getElementById('pageContent');
    const tableContent = document.getElementById('tableContent');

    if (route === 'connect/telegram') {
        fetch('http://localhost:3000/connect/telegram')
            .then(response => response.text())
            .then(html => {
                pageContent.innerHTML = html;
                tableContent.style.display = 'none'; 
            })
            .catch(error => console.error('Error fetching the page:', error));
    } else {
        pageContent.innerHTML = ''; 
        tableContent.style.display = 'block'; 
    }
}


// Handle back/forward navigation
window.addEventListener('popstate', () => {
    const route = location.pathname.replace('/', '');
    loadPage(route);
});

// Initial load
const initialRoute = location.pathname.replace('/', '');
loadPage(initialRoute || 'home');



// Handling the logo click
document.querySelector('.logo').onclick = function () {
    history.pushState(null, '', '/');
    loadPage('home'); // Ensure the home content is loaded
};



// Function to fetch crypto data from the backend
async function fetchCryptoData() {
    try {
        const response = await fetch('http://localhost:3000/api/crypto-data');
        if (response.ok) {
            const data = await response.json();
            console.log('Fetched data:', data);
            // Process and display data in your frontend
            displayData(data); // Implement this function based on your needs
        } else {
            console.error('Failed to fetch data:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example function to display data in table 
function displayData(data) {
    const tableContent = document.getElementById('cryptoTable').getElementsByTagName('tbody')[0];
    let sumLastPrices = 0.0;
    const numberOfItems = data.length;

    data.forEach(item => {
        const row = tableContent.insertRow();
        row.insertCell(0).textContent = item.name;
        row.insertCell(1).textContent = '₹ ' + Math.round(item.last);
        row.insertCell(2).textContent = '₹ ' + Math.round(item.buy) + ' / ' + '₹ ' + Math.round(item.sell);
        row.insertCell(3).textContent = item.volume;
        row.insertCell(4).textContent = item.base_unit;

        sumLastPrices += parseFloat(item.last);
        console.log(sumLastPrices)
    });

    // Calculate the average last price
    let averageLastPrice = sumLastPrices / numberOfItems; // Avoid division by zero
    averageLastPrice = isNaN(averageLastPrice) ? 0 : Math.round(averageLastPrice); // Handle NaN

    const averageLastPriceElement = document.getElementById('averageLastPrice');
    averageLastPriceElement.textContent = '₹ ' + averageLastPrice;
}
document.addEventListener('DOMContentLoaded', fetchCryptoData);





// toggle function
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        // Save the theme preference in localStorage
        const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
});
