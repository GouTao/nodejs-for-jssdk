# 微信jssdk权限验证
利用nodejs开发服务端程序用与前端验证微信jssdk权限

# 使用
	服务器开启nodejs服务 app.js
	引入 
	```html
	<script type="text/javascript" src="js/jquery.min.js" ></script>
	<script type="text/javascript" src="js/webchatJSSDKConfig.js" ></script>
	<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
	```

# 方法
	$.webchatCongfig.checkWXBrowser({
		default:false,//将会验证是否处于调试模式不在微信浏览器打开，默认为false已经开打,true不在微信浏览器打开
		sucFunction:function(){}, //在微信浏览器打开,不传值将返回true
		errFunction:function(){}, //不在微信浏览器打开,不传值将返回false
	})
	
	$.webchatCongfig.signformation({
		signSuccess:function(){}, //签名成功,必须填写
		signError:function(){}, //签名失败,可以不填写
	})

