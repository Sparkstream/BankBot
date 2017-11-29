
var request = require('request');

//The RestClient prepares the parameters that are required to be sent for a GET/POST Request


exports.getExchangeRates = function getData(url,session,callback){

    request.get(url,function handleGetResponse(err,res,body){
        if(err){
            console.log(err);
        }else{
            callback(body,session);
        }
   
    });
};

exports.postBaseCurrency = function postData(url,username,baseCurrency){
    var options = {
        url: url,
        method: 'POST',
        headers:{
            'ZUMO-API-VERSION':'2.0.0',
            'Content-Type':'application/json'
        },
        json : {
            "username" : username,
            "baseCurrency" : baseCurrency
        }
    };
    request(options,function(err,response,body){
        if(!err && response.statusCode === 200){
            console.log(body);
        }else{
            console.log(err);
        }
    })
};

exports.getBaseCurrency = function getData(session,url,username,callback){
    request.get(
        url,
        {'headers': 
            {'ZUMO-API-VERSION':'2.0.0'}
        }
        ,function handleGetResponse(err,res,body){
            if(err){
                console.log(err);
            }else{
                callback(body,session,username);
            }
        }
    );
};

exports.deleteBaseCurrency = function deleteData(url,session,username,baseCurrency,id,callback){
    
    var options ={
        url: url + "\\" + id ,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION' : '2.0.0',
            'Content-Type' : 'application/json'
        }
    };

    request(options,function(err,res,body){
        if(!err && res.statusCode === 200){
            console.log(body);
            callback(body,session,username,baseCurrency);
        }else{
            console.log(err);
            console.log(res);
        }
    })
};