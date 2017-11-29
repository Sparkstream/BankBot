var request = require('request');

exports.getFeedback = function (session,feedback) {
    request.post({
        url: "https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment",
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': 'd4695388293640c9a8bcdae3e133f8fb',
            'Accept' : 'application/json'
        },
        body: {
            "documents": [
                {
                    "language": "en",
                    "id": "1",
                    "text": feedback
                }
            ]
        }
    },function(error,response,body){
        if(checkResponse(body) == "successful"){
            var rating = (body.documents[0].score)*100;
            if(rating>=75){
                session.send("I'm glad you enjoyed this experience.");
            }else if(rating>=50 && rating<=70){
                session.send("We hope to improve your experience based on your feedback");
            }else{
                session.send("We are sorry to hear of your experience and hope you have a better experience in future. ");
            }
        }else if (checkResponse(body) == "error"){
            session.send("An error was detected. The service is either down or invalid inputs were provided.");
        }
        // if (error){
        //     return console.error ('failure: ', error);
        // }
        // console.log('Something\'s happening: ', feedback);
        // session.send(body.documents[0].score*100);
        
    });
}

function checkResponse(body){
    if(body && body.documents && body.documents[0].score){
        return "successful";
    }else{
        //console.log('An error was detected. The service is either down or invalid inputs were provided.');
        return "error";
    }
}