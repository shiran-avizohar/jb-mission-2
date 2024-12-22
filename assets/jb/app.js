"use strict";

const apiUrl = "https://restcountries.com/v3.1/";

// Fetch all countries
async function fetchAllCountries() {
    try {
        const response = await fetch(`${apiUrl}all`);
        if (!response.ok) throw new Error('Failed to fetch countries');
        return await response.json();
    } catch (error) {
        alert(error.message);
        return [];
    }
}

// Fetch countries by name
async function fetchCountriesByName(name) {
    try {
        const response = await fetch(`${apiUrl}name/${name}`);
        if (!response.ok) throw new Error('No countries found');
        return await response.json();
    } catch (error) {
        alert(error.message);
        return [];
    }
}

// Render table with country names and population
function renderTable(countries) {
    const tableBody = document.querySelector('#resultsTable tbody');
    tableBody.innerHTML = countries.map(country => {
        const population = country.population ? country.population.toLocaleString() : 'N/A';
        return `
            <tr>
                <td>${country.name.common}</td>
                <td>${population}</td>
            </tr>
        `;
    }).join('');
}

// Render population table
function renderPopulationTable(countries) {
    const tableBody = document.querySelector('#populationTable tbody');
    tableBody.innerHTML = countries.map(country => {
        const population = country.population ? country.population.toLocaleString() : 'N/A';
        return `
            <tr>
                <td>${country.name.common}</td>
                <td>${population}</td>
            </tr>
        `;
    }).join('');
}

// Render region statistics
function renderRegionTable(countries) {
    const regionCount = countries.reduce((acc, country) => {
        const region = country.region || "Unknown";
        acc[region] = (acc[region] || 0) + 1;
        return acc;
    }, {});

    const tableBody = document.querySelector('#regionTable tbody');
    tableBody.innerHTML = Object.entries(regionCount).map(([region, count]) => `
        <tr>
            <td>${region}</td>
            <td>${count}</td>
        </tr>
    `).join('');
}

// Render overall statistics
function renderStats(countries) {
    const totalCountries = countries.length;
    const totalPopulation = countries.reduce((sum, country) => sum + (country.population || 0), 0);
    const avgPopulation = totalCountries > 0 ? (totalPopulation / totalCountries).toFixed(2) : 0;
    const regions = [...new Set(countries.map(country => country.region || 'Unknown'))];

    const stats = `
        Total Countries: ${totalCountries}<br>
        Total Population: ${totalPopulation.toLocaleString()}<br>
        Average Population: ${avgPopulation.toLocaleString()}<br>
        Unique Regions: ${regions.length} (${regions.join(', ')})
    `;
    document.getElementById('stats').innerHTML = stats;
}

// Render currency statistics
function renderCurrencyStats(countries) {
    const currencyCount = countries.reduce((acc, country) => {
        const currencies = country.currencies || {};
        Object.values(currencies).forEach(currency => {
            const currencyName = currency.name || "Unknown";
            acc[currencyName] = (acc[currencyName] || 0) + 1;
        });
        return acc;
    }, {});

    const tableBody = document.querySelector('#currencyTable tbody');
    tableBody.innerHTML = Object.entries(currencyCount).map(([currency, count]) => `
        <tr>
            <td>${currency}</td>
            <td>${count}</td>
        </tr>
    `).join('');
}

// Event listeners for searching by country name
document.getElementById('searchButton').addEventListener('click', async () => {
    const name = document.getElementById('countryInput').value.trim();
    if (!name) return alert('Please enter a country name');
    const countries = await fetchCountriesByName(name);
    if (countries.length > 0) {
        renderTable(countries);
        renderPopulationTable(countries); // Render country population table
        renderStats(countries);
        renderRegionTable(countries);
        renderCurrencyStats(countries);  // Render currency statistics
    }
});

// Event listeners for displaying all countries
document.getElementById('allButton').addEventListener('click', async () => {
    const countries = await fetchAllCountries();
    if (countries.length > 0) {
        renderTable(countries);
        renderPopulationTable(countries); // Render country population table
        renderStats(countries);
        renderRegionTable(countries);
        renderCurrencyStats(countries);  // Render currency statistics
    }
});
