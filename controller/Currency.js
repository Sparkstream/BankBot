var rest = require('../API/RestClient');
var luis = require('./LuisDialog');

exports.displayAvailableCurrencies = function getExchangeRates(session, callback) {

    var url = 'https://api.fixer.io/latest';
    rest.getExchangeRates(url, session, getExchangeRateResponseHandler(callback,session))

};

function getExchangeRateResponseHandler(callback,session) {
    return function (message, session) {
        var exchangeRateResponse = JSON.parse(message);
        var allCurrencies = [];
        var exchangeRates = [];
        for (var index in exchangeRateResponse.rates) {
            allCurrencies.push(index);
            exchangeRates.push(exchangeRateResponse.rates[index]);
        }

        callback(allCurrencies, exchangeRates,session);

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

exports.addBaseCurrency = function postBaseCurrency(session, username, baseCurrency) {

    var url = 'https://contosobankbot0.azurewebsites.net/tables/BankBot';
    rest.postBaseCurrency(url, username, baseCurrency);

};

exports.displayBaseCurrency = function getBaseCurrency(session, username) {

    var url = 'https://contosobankbot0.azurewebsites.net/tables/BankBot';
    rest.getBaseCurrency(session, url, username, handleCurrencyResponse);

};

function handleCurrencyResponse(message, session, username) {

    var baseCurrencyResponse = JSON.parse(message);
    var baseCurrencies = [];

    for (var object in baseCurrencyResponse) {
        var usernameRegistered = baseCurrencyResponse[object].username;
        if(usernameRegistered){
            if (username.toLowerCase() == usernameRegistered.toLowerCase()) {
               baseCurrencies.push(baseCurrencyResponse[object].baseCurrency);
            }
        }
    }
    if(baseCurrencies.length == 0){
        session.send("You have not set any base currencies.");
    }else{
        session.send("Hi %s, your base currencies are currently set to %s", username, baseCurrencies);
    }
}

exports.deleteBaseCurrency = function getBaseCurrency(session, username,baseCurrency) {
    
        var url = 'https://contosobankbot0.azurewebsites.net/tables/BankBot';
        rest.getBaseCurrency(session, url, username, function(message,session,username){
            var baseCurrencyList =JSON.parse(message);
            for(var index in baseCurrencyList){
                if((baseCurrencyList[index].baseCurrency.toLowerCase() === baseCurrency.toLowerCase()) && (baseCurrencyList[index].username.toLowerCase() === username.toLowerCase())){
                    console.log(baseCurrencyList[index]);
                    rest.deleteBaseCurrency(url,session,username,baseCurrency,baseCurrencyList[index].id,handleDeleteCurrencyResponse);
                }
            }

        });
    
};

function handleDeleteCurrencyResponse(body,session,username,baseCurrency){
    console.log('Delete successful');
}