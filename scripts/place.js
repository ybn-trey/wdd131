document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

const temp = 28;
const windSpeed = 10; 

function calculateWindChill(t, v) {
    
    return (
        13.12 +
        0.6215 * t -
        11.37 * Math.pow(v, 0.16) +
        0.3965 * t * Math.pow(v, 0.16)
    ).toFixed(1);
}

let windChillText = "N/A";
if (temp <= 10 && windSpeed > 4.8) {
    windChillText = calculateWindChill(temp, windSpeed) + " °C";
}

document.getElementById("windchill").textContent = windChillText;
