// Global variables with default values for the page
let base = 'EUR';
let initCountries = ['EUR', 'USD', 'AUD', 'CAD'];
let currData = {};

function initialize(){
    // Run the initial render to populate the button bar and bar graph
    let url = 'https://api.exchangeratesapi.io/latest';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Cache the current data
            currData = data.rates;
            base = data.base;
            currData[base] = 1.0;

            // Process the initial API call into the buttons at the top
            let selector = document.createElement('select');
            selector.setAttribute('id', 'selector');
            selector.addEventListener('change', newSelection);

            let toggles = document.createElement('div');
            toggles.classList.add('DataVis-title-buttonbar');

            // Make a list of all the countries to add
            let allCountries = Object.keys(currData);
            allCountries.sort();

            // Create a button and drop down option for each country
            for(let country of allCountries){
                // Create a new option for each 
                newOption = document.createElement('option')
                newOption.textContent = country;
                selector.appendChild(newOption);

                // Create a toggle button for each country found in the exchange data base
                newToggle = document.createElement('button');
                newToggle.textContent = country;
                newToggle.classList.add('DataVis-title-buttonbar-button');
                newToggle.addEventListener('click', function(){
                    toggleCountry(this)
                });
                // Toggle the default settings
                if(initCountries.includes(country)){
                    newToggle.classList.add('DataVis-title-buttonbar-button--toggle');
                }
                toggles.appendChild(newToggle);
            }
            // Make sure the base is chosen
            selector.value = data.base;

            // Add to the title bar with labels
            let titleBar = document.querySelector('.DataVis-title');
            
            let p1 = document.createElement('p');
            p1.textContent = 'Choose base currency:';
            titleBar.appendChild(p1);
            titleBar.appendChild(selector);

            let p2 = document.createElement('p');
            p2.textContent = 'Toggle countries to display:';
            titleBar.appendChild(p2);
            titleBar.appendChild(toggles);

            // Finally, build the graph
            makeGraph();
        });    
}

function makeGraph(){
    // Builds the graph based on the data
 
    // Get the toggled buttons
    let toggled = document.querySelectorAll('.DataVis-title-buttonbar-button--toggle');

    // First find the minimum rate for all the countries
    let min = Number.MAX_SAFE_INTEGER;
    for(let currCountry of toggled){
        let value = currData[currCountry.textContent];
        if(min > value){
            min = value
        }
    }

    // Get the bar graph area and clear the area
    let bars = document.querySelector('#graph'); 
    bars.innerHTML = '';

    // Add children back in
    for (let currCountry of toggled) {
        let value = currData[currCountry.textContent];

        // Create an element to hold the data
        let newBar = document.createElement('div');
        newBar.className = 'DataVis-content-bar';
        newBar.style.height = (min / value) * 100 + '%';
        newBar.textContent = currCountry.textContent;
        newBar.onclick = function () { alert(currCountry.textContent + ' to ' + base + ': ' + value + ' to 1'); }
        bars.appendChild(newBar);
    }
}

function newSelection(){
    // Change the base currency, so make a new API request and rebuild the graph
    let selection = document.querySelector('select');
    base = selection.value;
    
    // Fetch new data due to the change of the base
    let url = 'https://api.exchangeratesapi.io/latest?base=' + base;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            currData = data.rates;
            currData[base] = 1.0;
            makeGraph();
        });
}

function toggleCountry(elem){
    // Toggles the country and re-renders the page
    elem.classList.toggle('DataVis-title-buttonbar-button--toggle');
    makeGraph();
}

initialize();