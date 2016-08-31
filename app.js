/**
 * 微信订阅号获取jssdk权限
 */

var port = 10005;
var http = require("http"), url = require("url"),querystring = require("querystring"),crypto = require('crypto');;
var appid = "你的appid",secret = "你的secret";
var at,atTime=0;
var ticket,ticketTime=0;

function start(){
    http.createServer(function(req,res){
        req.setEncoding("utf-8");
        var chunkData = "";
        var theRes = res;
        req.addListener("data",function(dataCut){
            chunkData += dataCut;
        });
        req.addListener("end",function(){
            //log(req.headers)
            try{
                var params=JSON.parse(querystring.parse(chunkData)["data"]);
                getAT(params,theRes);
            }catch(e){
                log("Data with wrong information:\n"+e.message);
            }
        });
    }).listen(port,function(){
        log("HttpServer running at PORT:"+port);
    });
}

start();

function getAT(data,resIn){
    if(data.command == "getTicket"){
        var nowTime = new Date().getTime()/1000;
        var url = data.urlPath;
        if(nowTime - atTime > 7200){
             var getHttp = require("https");
             getHttp.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appid+"&secret="+secret,function(req){
                var chunkData;
                req.addListener("data",function(dataCut){
                    chunkData += dataCut;
                });
                req.addListener("end",function(){
                    var jsonStr = chunkData.substr(9,chunkData.length-1);
                    var jsonData = JSON.parse(jsonStr);
                    ac = jsonData.access_token;
                    atTime = new Date().getTime()/1000;
                    getTickect(resIn,url);
                });
                req.addListener("error",function(){
                    sendData(resIn,"未能链接到微信服务器",false);
                })
            })
        }
        else{
            getTickect(resIn,url);
        } 
    }
}

function getTickect(resIn,url){
    var nowTime = new Date().getTime()/1000;
    if(nowTime - ticketTime > 7200){
            var getHttp = require("https");
            getHttp.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+ac+"&type=jsapi",function(req){
            var chunkData;
            req.addListener("data",function(dataCut){
                chunkData += dataCut;
            });
            req.addListener("end",function(){
                var jsonStr = chunkData.substr(9,chunkData.length-1);
                var jsonData = JSON.parse(jsonStr);
                ticket = jsonData.ticket;
                console.log
                ticketTime = new Date().getTime()/1000;
                sign(resIn,url);
            });
            req.addListener("error",function(){
                sendData(resIn,"未能链接到微信服务器",false);
            })
        })
    }
    else{
        sign(resIn,url);
    } 
}

function sign(resIn,url){
    var nonceStr = randomString(16);
    var jsapi_ticket = ticket;
    var timestamp = parseInt(new Date().getTime()/1000);
    var str = "jsapi_ticket="+jsapi_ticket+"&noncestr="+nonceStr+"&timestamp="+timestamp+"&url="+url;
    var shasum = crypto.createHash('sha1');
    shasum.update(str);
    var signature = shasum.digest('hex');
    var signObj = {"appId":appid,"timestamp":timestamp,"nonceStr":nonceStr,"signature":signature};
    sendData(resIn,JSON.stringify(signObj),true);
}

function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; 
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}

function sendData(target,resData,ifSuccess){
	target.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"*","Cache-Control":"no-cache, no-store, must-revalidate","Pragma":"no-cache","Expires":"0"});
	if(ifSuccess){
		var sucInfo=new Object();
		sucInfo.result="success";
		sucInfo.msg="";
		sucInfo.data=resData;
		target.write(JSON.stringify(sucInfo));	
	}
	else{
		var errInfo=new Object();
		errInfo.result="failed";
        sucInfo.msg=resData;
		sucInfo.data="";
		target.write(JSON.stringify(errInfo));
	}
	target.end();
}

function log(str){
	console.log("==>>"+str);
}

exports.start=start;
