var builder = require('botbuilder');
var currency = require('./Currency');
//var cs=require('./CognitiveServices');

exports.startDialog = function (bot) {

    ////New Link
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/ee24ef80-3621-4db5-ab10-8285c5598cac?subscription-key=d39a0899f54148b59855da2984eeff49&verbose=true&timezoneOffset=0&q=');
    ////Old Link

    //var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/53ebb2e9-54bd-4962-8f4e-8996a1b59e1e?subscription-key=007489717d0d4ad8a05fcb492688d7f9&verbose=true&timezoneOffset=0&q=');
    bot.recognizer(recognizer);

    bot.dialog('ConvertCurrency',
        function (session, args, next) {
            session.dialogData.args = args || {};

            //Obtains the supported currencies and a list of them
            session.sendTyping();
            setTimeout(function () {
            currency.displayAvailableCurrencies(session, function (currencyList, exchangeRates, session) {
                session.sendTyping();
                setTimeout(function () {
                    if (session.message && session.message.value) {
                        // process your card's submit action
                        var fromCurrency = session.message.value.sourceCurrency;
                        var toCurrency = session.message.value.destinationCurrency;
                        var currencyValue = session.message.value.number;
                        var equivalentValue;
                        currency.getExchangeRatesList(session, function (currencyList, exchangeRates) {

                            for (var dest in currencyList) {

                                if (toCurrency == currencyList[dest]) {
                                    equivalentValue = exchangeRates[dest];
                                    equivalentValue *= currencyValue;
                                }

                            } if (fromCurrency == toCurrency) {
                                session.send("%s %s is worth  %s %s ", currencyValue, fromCurrency, currencyValue, toCurrency);
                            } else {
                                session.send("%s %s is worth  %s %s ", currencyValue, fromCurrency, equivalentValue.toFixed(4), toCurrency);
                            }
                        }, fromCurrency)
                        console.log("Processing");
                        return;

                    };

                    session.send(new builder.Message(session).addAttachment({
                        contentType: "application/vnd.microsoft.card.adaptive",
                        content: {
                            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                            "type": "AdaptiveCard",
                            "version": "1.0",
                            "body": [
                                {
                                    "type": "ColumnSet",
                                    "columns": [
                                        {
                                            "type": "Column",
                                            "items": [
                                                {
                                                    "type": "TextBlock",
                                                    "text": "Value"
                                                },
                                                {
                                                    "type": "Input.Number",
                                                    "id": "number",
                                                    "placeholder": "Enter a number",


                                                    "value": 1.00
                                                }
                                            ]
                                        },
                                        {
                                            "type": "Column",
                                            "items": [
                                                {
                                                    "type": "TextBlock",
                                                    "text": "From"
                                                },
                                                {
                                                    "type": "Input.ChoiceSet",
                                                    "id": "sourceCurrency",
                                                    "style": "compact",
                                                    "isMultiSelect": false,
                                                    "value": "1",
                                                    "choices": [
                                                        {
                                                            "title": currencyList[0],
                                                            "value": currencyList[0]
                                                        },
                                                        {
                                                            "title": currencyList[1],
                                                            "value": currencyList[1]
                                                        },
                                                        {
                                                            "title": currencyList[2],
                                                            "value": currencyList[2]
                                                        }, {
                                                            "title": currencyList[3],
                                                            "value": currencyList[3]
                                                        },
                                                        {
                                                            "title": currencyList[4],
                                                            "value": currencyList[4]
                                                        },
                                                        {
                                                            "title": currencyList[5],
                                                            "value": currencyList[5]
                                                        },
                                                        {
                                                            "title": currencyList[6],
                                                            "value": currencyList[6]
                                                        },
                                                        {
                                                            "title": currencyList[7],
                                                            "value": currencyList[7]
                                                        },
                                                        {
                                                            "title": currencyList[8],
                                                            "value": currencyList[8]
                                                        },
                                                        {
                                                            "title": currencyList[9],
                                                            "value": currencyList[9]
                                                        },
                                                        {
                                                            "title": currencyList[10],
                                                            "value": currencyList[10]
                                                        },
                                                        {
                                                            "title": currencyList[11],
                                                            "value": currencyList[11]
                                                        },
                                                        {
                                                            "title": currencyList[12],
                                                            "value": currencyList[12]
                                                        }, {
                                                            "title": currencyList[13],
                                                            "value": currencyList[13]
                                                        },
                                                        {
                                                            "title": currencyList[14],
                                                            "value": currencyList[14]
                                                        },
                                                        {
                                                            "title": currencyList[15],
                                                            "value": currencyList[15]
                                                        },
                                                        {
                                                            "title": currencyList[16],
                                                            "value": currencyList[16]
                                                        },
                                                        {
                                                            "title": currencyList[17],
                                                            "value": currencyList[17]
                                                        },
                                                        {
                                                            "title": currencyList[18],
                                                            "value": currencyList[18]
                                                        },
                                                        {
                                                            "title": currencyList[19],
                                                            "value": currencyList[19]
                                                        },
                                                        {
                                                            "title": currencyList[20],
                                                            "value": currencyList[20]
                                                        },
                                                        {
                                                            "title": currencyList[21],
                                                            "value": currencyList[21]
                                                        },
                                                        {
                                                            "title": currencyList[22],
                                                            "value": currencyList[22]
                                                        }, {
                                                            "title": currencyList[23],
                                                            "value": currencyList[23]
                                                        },
                                                        {
                                                            "title": currencyList[24],
                                                            "value": currencyList[24]
                                                        },
                                                        {
                                                            "title": currencyList[25],
                                                            "value": currencyList[25]
                                                        },
                                                        {
                                                            "title": currencyList[26],
                                                            "value": currencyList[26]
                                                        },
                                                        {
                                                            "title": currencyList[27],
                                                            "value": currencyList[27]
                                                        },
                                                        {
                                                            "title": currencyList[28],
                                                            "value": currencyList[28]
                                                        },
                                                        {
                                                            "title": currencyList[29],
                                                            "value": currencyList[29]
                                                        }

                                                    ]

                                                }
                                            ]
                                        },
                                        {
                                            "type": "Column",
                                            "items": [
                                                {
                                                    "type": "TextBlock",
                                                    "text": "To"
                                                },
                                                {
                                                    "type": "Input.ChoiceSet",
                                                    "id": "destinationCurrency",
                                                    "style": "compact",
                                                    "isMultiSelect": false,
                                                    "value": "1",
                                                    "choices": [
                                                        {
                                                            "title": currencyList[0],
                                                            "value": currencyList[0]
                                                        },
                                                        {
                                                            "title": currencyList[1],
                                                            "value": currencyList[1]
                                                        },
                                                        {
                                                            "title": currencyList[2],
                                                            "value": currencyList[2]
                                                        }, {
                                                            "title": currencyList[3],
                                                            "value": currencyList[3]
                                                        },
                                                        {
                                                            "title": currencyList[4],
                                                            "value": currencyList[4]
                                                        },
                                                        {
                                                            "title": currencyList[5],
                                                            "value": currencyList[5]
                                                        },
                                                        {
                                                            "title": currencyList[6],
                                                            "value": currencyList[6]
                                                        },
                                                        {
                                                            "title": currencyList[7],
                                                            "value": currencyList[7]
                                                        },
                                                        {
                                                            "title": currencyList[8],
                                                            "value": currencyList[8]
                                                        },
                                                        {
                                                            "title": currencyList[9],
                                                            "value": currencyList[9]
                                                        },
                                                        {
                                                            "title": currencyList[10],
                                                            "value": currencyList[10]
                                                        },
                                                        {
                                                            "title": currencyList[11],
                                                            "value": currencyList[11]
                                                        },
                                                        {
                                                            "title": currencyList[12],
                                                            "value": currencyList[12]
                                                        }, {
                                                            "title": currencyList[13],
                                                            "value": currencyList[13]
                                                        },
                                                        {
                                                            "title": currencyList[14],
                                                            "value": currencyList[14]
                                                        },
                                                        {
                                                            "title": currencyList[15],
                                                            "value": currencyList[15]
                                                        },
                                                        {
                                                            "title": currencyList[16],
                                                            "value": currencyList[16]
                                                        },
                                                        {
                                                            "title": currencyList[17],
                                                            "value": currencyList[17]
                                                        },
                                                        {
                                                            "title": currencyList[18],
                                                            "value": currencyList[18]
                                                        },
                                                        {
                                                            "title": currencyList[19],
                                                            "value": currencyList[19]
                                                        },
                                                        {
                                                            "title": currencyList[20],
                                                            "value": currencyList[20]
                                                        },
                                                        {
                                                            "title": currencyList[21],
                                                            "value": currencyList[21]
                                                        },
                                                        {
                                                            "title": currencyList[22],
                                                            "value": currencyList[22]
                                                        }, {
                                                            "title": currencyList[23],
                                                            "value": currencyList[23]
                                                        },
                                                        {
                                                            "title": currencyList[24],
                                                            "value": currencyList[24]
                                                        },
                                                        {
                                                            "title": currencyList[25],
                                                            "value": currencyList[25]
                                                        },
                                                        {
                                                            "title": currencyList[26],
                                                            "value": currencyList[26]
                                                        },
                                                        {
                                                            "title": currencyList[27],
                                                            "value": currencyList[27]
                                                        },
                                                        {
                                                            "title": currencyList[28],
                                                            "value": currencyList[28]
                                                        },
                                                        {
                                                            "title": currencyList[29],
                                                            "value": currencyList[29]
                                                        }
                                                    ]

                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "actions": [
                                {
                                    "type": "Action.Submit",
                                    "title": "Convert Currency",
                                    "data": {
                                        "type": "CurrencyConversion"
                                    }
                                }
                            ]

                        }
                    }))
                }, 1000);
            })
        }, 1000);
}
    ).triggerAction({
    matches: 'ConvertCurrency'
});

bot.dialog('WelcomeIntent', function (session, args) {

    session.send("Konnichiwa! Hello! Namaste! \n\n Welcome to Contoso Bank Ltd's banking bot!\n\n Here's a list of tasks I may be able to assist you with.");
    builder.Prompts.choice(session, "Please select an option from the following", "Currency Conversion|Exchange Rates|View Base Currencies", { listStyle: builder.ListStyle.button });
    session.endDialog();
}).triggerAction({
    matches: 'WelcomeIntent'
});


bot.dialog('GetExchangeRates', [function (session, args) {

    session.dialogData.args = args || {};
    //Displays to the user a list of supported currencies to view exchange rates for.
    if (!session.dialogData["baseCurrency"]) {
        currency.displayAvailableCurrencies(session, function (currencyList) {
            builder.Prompts.choice(session, "To view the exchange rates, please select a supported currency from below.", currencyList, { listStyle: builder.ListStyle.button });
        })
    } else {
        next();
    }
},

//Obtains the exchange rates and presents them to the user in a list
function (session, results, next) {

    session.dialogData["baseCurrency"] = results.response;
    var exchangeRatesList = "";

    currency.getExchangeRatesList(session, function (currencyList, exchangeRates) {

        for (i in currencyList) {
            exchangeRatesList = exchangeRatesList + currencyList[i] + "\t\t" + exchangeRates[i] + "\n\n";
        }
        session.send("%s", exchangeRatesList);
    }, session.dialogData["baseCurrency"].entity);


}]).triggerAction({
    matches: 'GetExchangeRates'
});

bot.dialog('SetBaseCurrency', [

    function (session, args, next) {

        session.dialogData.args = args || {};

        if (!session.conversationData["username"]) {
            builder.Prompts.text(session, "To continue, please enter a username so we can identify you");
        } else {
            next();
        }

    },
    function (session, results, next) {

        if (results.response) {

            //results.response.entity = results.response.entitytoUpperCase();
            session.conversationData["username"] = results.response;
        }

        if (!session.conversationData["baseCurrency"]) {
            builder.Prompts.choice(session, "Would you like to set your base currency", "Yes|No", { listStyle: builder.ListStyle.button });
        } else {
            next();
        }
    },
    function (session, results, next) {

        if (results.response) {

            var optionSelected = results.response.entity;
            var currencyEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'currency');

            if (optionSelected.toLowerCase() == "yes" && currencyEntity) {

                session.send("Setting %s as your base currency", currencyEntity.entity.toUpperCase());
                currency.addBaseCurrency(session, session.conversationData["username"], currencyEntity.entity.toUpperCase());

            } else if (optionSelected.toLowerCase() == "no" && currencyEntity) {
                session.send("Cancelling the request...");
            } else {
                session.send("Invalid inputs. An unsupported currency was detected or invalid code was entered. \n\n Remember to enter the currency as a 3 letter code");
            }

        }
    }

]).triggerAction({
    matches: 'SetBaseCurrency'
});

bot.dialog('GetBaseCurrency', [

    function (session, args, next) {
        session.dialogData.args = args || {};

        if (!session.conversationData["username"]) {
            builder.Prompts.text(session, "To continue, please enter a username so we can identify you");
        } else {
            next();
        }

    },
    function (session, results, next) {
        if (results.response) {
            session.conversationData["username"] = results.response;
        }
        session.send("Extracting your currently set base currencies...");
        currency.displayBaseCurrency(session, session.conversationData["username"]);
    }

]).triggerAction({
    matches: 'GetBaseCurrency'
});

bot.dialog('DeleteBaseCurrency', [

    function (session, args, next) {
        session.dialogData.args = args || {};

        if (!session.conversationData["username"]) {
            builder.Prompts.text(session, "To continue, please enter a username so we can identify you");
        } else {
            next();
        }

    },
    function (session, results, next) {

        var currencyEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'currency');

        if (results.response) {
            session.conversationData["username"] = results.response;
        }
        session.send("Deleting %s from your base currencies. ", currencyEntity.entity);
        currency.deleteBaseCurrency(session, session.conversationData["username"], currencyEntity.entity);

    }

]).triggerAction({
    matches: 'DeleteBaseCurrency'
});


}
