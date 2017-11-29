var builder = require('botbuilder');
var currency = require('./Currency');
var cs = require('./CognitiveServices');

exports.startDialog = function (bot) {

    ////New Link
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/ee24ef80-3621-4db5-ab10-8285c5598cac?subscription-key=d39a0899f54148b59855da2984eeff49&verbose=true&timezoneOffset=0&q=');
    ////Old Link

    bot.recognizer(recognizer);

    //Matches the user's conversation to the bot and starts the WelcomeIntentDialog.
    bot.on('conversationUpdate', function (message) {
        if (message.membersAdded) {
            message.membersAdded.forEach(function (identity) {
                if (identity.id === message.address.bot.id) {
                    bot.beginDialog(message.address, 'WelcomeIntent');
                }
            });
        }
    });

    bot.dialog('ConvertCurrency',
        function (session, args, next) {
            session.dialogData.args = args || {};

            //Obtains the supported currencies and a list of them
            session.sendTyping();
            setTimeout(function () {
                currency.displayAvailableCurrencies(session, function (currencyList, session) {
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
        session.send("Konnichiwa! Hello! Namaste! \n\n Welcome to Contoso Bank Ltd's banking bot!\n\n If you require help at any time type \'help\'. \n\n Here's a list of tasks I may be able to assist you with.");
        builder.Prompts.choice(session, "Please select an option from the following", "Currency Conversion|Exchange Rates|View Base Currencies|Give Feedback|Help", { listStyle: builder.ListStyle.button });
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
    bot.dialog('GiveFeedback', [

        function (session,args,next) {
		session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Please enter a username so we can identify you. This information will not be used for commercial purposes.");
            } else {
                next();
            }
        }, function (session, results, next) {
            if (results.response) {
                session.conversationData["username"] = results.response;
                builder.Prompts.text(session, "How did you find your experience with this session?");
            } else {
                next();
            }

        }, function (session, results, next) {
                var feedback = results.response;
                console.log("In");
                cs.getFeedback(session,feedback);
            
        }

    ]).triggerAction({
        matches: 'GiveFeedback'
    });
    bot.dialog('HelpIntent',
        [function(session){
            if(!session.dialogData["optionSelected"]){
                builder.Prompts.choice(session,"Which function would you like to know more about? ","Currency Conversion|Exchange Rates|View Base Currencies|Set your own base currencies|Remove a base currency|Give feedback for the developers",{ listStyle: builder.ListStyle.button });
            }else{
                next();
            }
        },function(session,results,next){
        
            if(results.response){
                var optionSelected = results.response.entity;
                //session.send(results.response);
                if(optionSelected == "Currency Conversion"){
                    session.send("To use the currency conversion function, enter the amount you want to convert in \'From\' to '\To\' and press \'Convert Currency\'");
                }else if (optionSelected == "Exchange Rates"){
                    session.send("Select the currency you wish to view all exchange rates for. ")
                }else if(optionSelected == "View Base Currencies"){
                    session.send("To view the base currency, you can click the button from the list of options initially.\n\n You can also type in a phrase such as \'what are my base currencies\'");
                }else if(optionSelected == "Set your own base currencies"){
                    session.send("To set your base currencies, you can type in a phrase such as \'make AUD my base currency\' \n\n Please ensure your currency is a 3 letter code before setting");
                }else if(optionSelected == "Remove a base currency"){
                    session.send("To remove a base currency, you can type in a phrase such as \'delete AUD from my base currency\' \n\n A currency should be set before attempting this");
                }else if(optionSelected == "Give feedback for the developers"){
                    session.send("If you have any feedback you would like to leave for the awesome developers, \n\n you can type in a phrase such as \'Give Feedback\' to trigger the function.\n\n A username must be specified within the conversation to give feedback. ");
                }
                
            }
            
        }
        ]).triggerAction({
        matches: 'HelpIntent'
    });


}
