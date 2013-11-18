/// Global event handlers
var callbacks = {};

/// Translate function
var translate = function(txt){
	var result = txt;
	if (typeof TRANSLATIONS !== "undefined" && typeof TRANSLATIONS === "object" && TRANSLATIONS[txt]) {
		result = TRANSLATIONS[txt];
	}
	return result;
};

/// IE check
function ie() {
	return (navigator.appVersion.indexOf("MSIE 6") != -1 || navigator.appVersion.indexOf("MSIE 7") != -1 || navigator.appVersion.indexOf("MSIE 8") != -1);
}

/// Execute callback
var execCallback = function(id) {
	if (!callbacks[id])
		return;
	callbacks[id].call();
};

/// Wrap callback
function wrapCallback(callback) {
	var id = (new Date()).getTime();
	callbacks[id] = callback;
	return id;
}

/// Fetch varable from 'GET' request
function getHtmlVar(name) {
	if (!name)
		return null;
	var pairs = decodeURIComponent(document.location.search.substr(1)).split("&");
	for (var i = 0; i < pairs.length; i++) {
		var pair = pairs[i].split("=");
		if (pair[0] == name) {
			pair.splice(0, 1);
			return pair.join("=");
		}
	}
	return null;
}

/// Load script
function loadScript(src, callback) {
	var script = document.createElement("script");
	script.setAttribute("type","text/javascript");
	script.setAttribute("charset","UTF-8");
	script.setAttribute("src", src);
	if (callback && typeof callback == "function") {
		wrapCallback(callback);
		if (ie())
			script.onreadystatechange = function () {
				if (this.readyState == 'complete' || this.readyState == 'loaded')
					callback();
			};
		else
			script.setAttribute("onLoad", "execCallback(" + wrapCallback(callback) + ")");
	}
	document.getElementsByTagName("head")[0].appendChild(script);
}

/// Login result
function login(code) {
	console.log( translate("login") + ": " + code );
	if (code) {
		alert( translate("Login error") );
		return;
	}
	alert( translate("Hello") + ", " + wialon.core.Session.getInstance().getCurrUser().getName() + "!" );
}

/// Init SDK
function initSdk() {
	console.log( translate("initialize sdk") );
	var url = getHtmlVar("baseUrl") || getHtmlVar("hostUrl") || "https://hst-api.wialon.com";
	wialon.core.Session.getInstance().initSession(url);
	wialon.core.Session.getInstance().duplicate(getHtmlVar("sid"), "", true, login);
}

function ltranslate() {
	//translation logic here
}

/// We are ready now
function onLoad() {
	// load translations
	var lang = getHtmlVar("lang") || "en";
	if (["en", "ru"].indexOf(lang) == -1){
		lang = "en";
	}
	
	$.localise("lang/", {language:lang, complete:ltranslate});
	translate = $.localise.tr;
	
	// load wialon.js
	var url = getHtmlVar("baseUrl") || getHtmlVar("hostUrl") || "https://hst-api.wialon.com";
	loadScript(url+"/wsdk/script/wialon.js", initSdk);
}


$(document).ready(onLoad);
