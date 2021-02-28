// Global variables with default values for the page
let base = 'EUR';
let countries = ['EUR', 'USD', 'GBP', 'CAD', 'AUD'];

function render(){
    // Renders the page
    console.log('Rendering page');

    // Fetch the data specified by input
    console.log('Fetching the data');
    // Build the fetch url
    let url = 'https://api.exchangeratesapi.io/latest?base=' + base;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log('Building the buttons')

            // Render the bar graph
            console.log('Building the bar graph')
            let bars = document.querySelector('#graph');           

            // Get the maximum value from the currency exchange
            let min = Number.MAX_SAFE_INTEGER;
            for(const [key, value] of Object.entries(data.rates)){
                if(min > value){
                    min = value;
                }
            }
            
            // Version 1 - create new elements and append
            // Remove all children
            while(bars.firstChild){
                bars.removeChild(bars.firstChild)
            }
            
            // Special add for the base country
            baseIndex = countries.indexOf(base)
            if(baseIndex > -1){
                // Splice it out of the array
                countries.splice(baseIndex, 1);

                // Add new div for it
                let newBar = document.createElement('div');
                newBar.className = 'DataVis-content-bar';
                newBar.style.height = min * 100 + '%';
                newBar.textContent = base;
                newBar.onclick = function(){ alert(base + ' to ' + base + ': 1 to 1'); }
                bars.appendChild(newBar);
            }

            // Add children back in
            for(let country of countries){                
                // Create an element to hold the data
                let newBar = document.createElement('div');
                newBar.className = 'DataVis-content-bar';
                newBar.style.height = (min / data.rates[country]) * 100 + '%';
                newBar.textContent = country;
                newBar.onclick = function(){ alert(key + ' to ' + base + ': ' + value + ' to 1'); }
                bars.appendChild(newBar);
            }
            
            /*
            // Version 2 - add HTML with backtick
            // Reset inner HTML
            bars.innerHTML = '';

            // Special add for the base country
            baseIndex = countries.indexOf(base)
            if(baseIndex > -1){
                // Splice it out of the array
                countries.splice(baseIndex, 1);

                // Add new div for it
                let height = min * 100;
                bars.innerHTML += `<div class="DataVis-content-bar" OnClick="alert('${base} to ${base}: 1 to 1')" style="height: ${height}%">
                    ${base}
                </div>
                `
            }

            // Add each bar individually
            for(let country of countries){
                let value = data.rates[country];
                let height = (min / value) * 100;
                bars.innerHTML += `<div class="DataVis-content-bar" OnClick="alert('${country} to ${base}: ${value} to 1')" style="height: ${height}%">
                    ${country}
                </div>
                `
            }     
            */       
        });
}

render();