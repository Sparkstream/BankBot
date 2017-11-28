var builder = require('botbuilder');
//var converter = require('./CurrencyConverter');
var currency = require('./Currency');


exports.startDialog = function (bot) {

    var currenciesToConvert = [];
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/53ebb2e9-54bd-4962-8f4e-8996a1b59e1e?subscription-key=007489717d0d4ad8a05fcb492688d7f9&verbose=true&timezoneOffset=0&q=');
    bot.recognizer(recognizer);
    
    

    bot.dialog('ConvertCurrency',
        [function (session, args, next) {
            session.dialogData.args = args || {};

            supportedCurrencies = [];
            exchangeRateList = [];
            
            //Obtains the supported currencies and a list of them
            
                currency.displayAvailableCurrencies(session,
                    function (currencyList, exchangeRates) {
                        //console.log(currencyList);
                        // supportedCurrencies = currencyList;
                        // exchangeRateList = exchangeRates;
                        session.sendTyping();
                        if (session.message && session.message.value) {
                            // process your card's submit action
                            var fromCurrency = session.message.value.sourceCurrency;
                            var toCurrency = session.message.value.destinationCurrency;
                            var currencyValue = session.message.value.number;
                            currency.getExchangeRatesList(session,function(currencyList,exchangeRates
                                
                            ){
                                if(fromCurrency==toCurrency){
                                    session.send("%s %s is worth  %s %s ",currencyValue,fromCurrency,currencyValue,toCurrency);
                                }
                                for(var dest in currencyList){
                                    
                                        if(toCurrency == currencyList[dest]){
                                            equivalentValue = exchangeRates[dest];
                                            equivalentValue*=currencyValue;
                                        }
                                        
                                }
                                session.send("%s %s is worth  %s %s ",currencyValue,fromCurrency,equivalentValue,toCurrency);
                            },fromCurrency)
                            
                            return;
                           }
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
                                        "title": "ConvertCurrency",
                                        "data": {
                                            "type": "CurrencyConversion"
                                        }
                                    }
                                ]

                            }
                        }))
                    
                    })

                    
                
                      
        }

        ]).triggerAction({
            matches: 'ConvertCurrency'
        });
    bot.dialog('WelcomeIntent', function (session, args) {

        session.send("Konnichiwa! Hello! Namaste! \n\n Welcome to Contoso Bank Ltd's banking bot!\n\n Here's a list of tasks I may be able to assist you with.");
        builder.Prompts.choice(session, "Please select an option from the following", "Currency Conversion|Interest Rates|Exchange Rates", { listStyle: builder.ListStyle.button });
        session.endDialog();
    }).triggerAction({
        matches: 'WelcomeIntent'
    });

    //Get exchange rates
    bot.dialog('GetExchangeRates', [function (session, args) {

        session.dialogData.args = args || {};
        supportedCurrencies = [];
        rates = [];
        if (!session.dialogData["baseCurrency"]) {
            currency.getCurrencies(session, function (currencyList) {
                builder.Prompts.choice(session, "To view the exchange rates, please select a supported currency from below.", currencyList, { listStyle: builder.ListStyle.button });
            })
        } else {
            next();
        }
    },

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

    bot.dialog('SetBaseCurrency',[function(session){
        if(!session.conversationData["baseCurrency"]){
            builder.Prompts.choice(session, "Would you like to set your base currency", "Yes|No", { listStyle: builder.ListStyle.button });
        }else{
            next();
        }
    }, function(session,results,next){
        if(results.response){
            session.send("You have chosen %s",results.response.entity);
        }
    }

    ]).triggerAction({
        matches: 'SetBaseCurrency'
    });
}
