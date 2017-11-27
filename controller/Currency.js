var rest = require('../API/RestClient');
var luis = require('./LuisDialog');

exports.displayAvailableCurrencies = function getExchangeRates(session, callback) {

    var url = 'https://api.fixer.io/latest';
    rest.getExchangeRates(url, session, getExchangeRateResponseHandler(callback))

};

function getExchangeRateResponseHandler(callback) {
    return function (message, session) {
        var exchangeRateResponse = JSON.parse(message);
        var allCurrencies = [];
        var exchangeRates = [];
        for (var index in exchangeRateResponse.rates) {
            allCurrencies.push(index);
            exchangeRates.push(exchangeRateResponse.rates[index]);
        }  

        callback(allCurrencies, exchangeRates);

    }
}
exports.getExchangeRatesList = function getValues(session, callback, base) {
    
    var url = 'https://api.fixer.io/latest?base=' + base;
    rest.getExchangeRates(url, session, exchangeRateValues(callback));

};
function exchangeRateValues(callback) {
    return function (message, session) {
        var exchangeRateResponse = JSON.parse(message);
        var allCurrencies = [];
        var exchangeRates = [];
        for (var index in exchangeRateResponse.rates) {
            allCurrencies.push(index);
            exchangeRates.push(exchangeRateResponse.rates[index]);
        }

        callback(allCurrencies, exchangeRates);

    }


}
