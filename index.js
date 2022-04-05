// Terminal Setup
console.clear();
console.log('SSL Cert Checker');
console.log();

// Dependency Setup
let data, https;

try {
    https = require('https');
} catch (e) {
    output('Something went wrong with the https package!', true);
    return false;
}

try {
    data = require('./data.js');
} catch (e) {
    output('Please setup your data.js file!', true);
    return false;
}

const websites = data.sites || [];

if (websites.length < 1) {
    output('Websites array in data.js is empty!', true);
    return false;
}

// Function Declarations
function test(url) {
    https.request({
        host: url,
        port: 443
    }, (res) => {
        let diff = Date.parse(res.connection.getPeerCertificate()['valid_to']) - Date.now();
        output(url + " expires in " + Math.floor(diff / 86400000) + " day(s)!");
    }).on('error', (err) => {
        switch(err.code) {
            case 'CERT_HAS_EXPIRED': output(url + ' has expired!', true); break;
            default: output('Something went wrong with ' + url + '!', true);
        }
    }).end();
}

function output(message, error = false) {
    if (error) {
        console.error(message);
    } else {
        console.log(message);
    }
}

// Main Loop
websites.forEach((url) => {
    test(url);
})