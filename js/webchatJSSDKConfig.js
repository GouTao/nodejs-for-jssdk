(function($){
	$.webchatConfig=(function webchatconfig(){
		var appId = "",timestamp = "",nonceStr = "",signature = "";
		var errCallBack,signCallback;
		var pathname = window.location.href;
	
		webchatconfig.checkWXBrowser = function(options){
			this.options={
				default:false,
				sucFunction:null,
				errFunction:null
			}
			if (typeof options === 'object') {
		        for (var i in options) {
		            if (options.hasOwnProperty(i)) {
		                this.options[i] = options[i];
		            }
		        }
		    }
			if(this.options.default==true){
				this.options.sucFunction();
				return true;
			}
			else{
				var ua = window.navigator.userAgent.toLowerCase(); 
				if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
					if(typeof this.options.sucFunction=='function'){
						this.options.sucFunction();
					}
					else{
						return true;
					}
				}else{ 
					if(typeof this.options.errFunction=='function'){
						this.options.errFunction();
					}else{
						return false;
					}		 
				} 
			}
		}
		
		webchatconfig.signInformation = function(options){
			this.options={
				signSuccess:null,
				signError:null
			};
			
			if (typeof options === 'object') {
		        for (var i in options) {
		            if (options.hasOwnProperty(i)) {
		                this.options[i] = options[i];
		            }
		        }
		    }
			if(typeof this.options.signSuccess!='function'){
				alert("请传入验证成功函数");
				return false;
			}
			else{
				signCallback=this.options.signSuccess;
			}
			
			if(typeof this.options.signError!='function'){
				errCallBack = function(){};
			}
			else{
				errCallBack = this.options.signError;
			}
		
			
			var data = {"command":"getTicket","urlPath":pathname};
			var str = JSON.stringify(data);
			
			$.ajax({
				type:"post",
				url:"http://111.111.111.111:10005",
				async:true,
				data:{"data":str},
				dataType:"json",
				success:function(res){
					if(res.result == "success"){
						var sp = JSON.parse(res.data);
						appId = sp.appId;
						timestamp = sp.timestamp;
						nonceStr = sp.nonceStr;
						signature = sp.signature;
						// 在这里调用 API
						wx.config({
							appId:appId,
							timestamp:timestamp,
							nonceStr:nonceStr,
							signature:signature,
							jsApiList: ['scanQRCode'],
							debug:false
						});
						wx.ready(function () {
							signCallback("signSuc");
						});
						
						wx.error(function(obj){
							errCallBack("signErr");
						});
					}
				},
				error:function(){
					errCallBack("connect error");
				}
			});
		};
		return webchatconfig;
	})()
})(jQuery);