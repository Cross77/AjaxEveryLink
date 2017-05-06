/*
* AjaxEveryLink (AEL) by Jeremiasz Mazur (https://github.com/Cross77/)
* MIT License
* WARNING: Please load this script at first on Your webpage.
*/
// init request
window.AEL = {
    Request: new XMLHttpRequest(),
    urlSeparator: '/',
    onLoad: function(){
        console.debug('ajaxEveryLink is loading...');
    },
    onNotify: function(msg){
        alert( 'Notify: ' + msg);
    },
    getHistory: function(){
        if( localStorage.__AEL__isHistory == 'false' ) return false;
        return JSON.parse(localStorage.__AEL__History);
    },
    isHistoryEnabled: function(){
        if(localStorage.__AEL__isHistory == 'true') return true;
        return false;
    },
    historyEnabled: function(value){
        debugger;
        localStorage.__AEL__isHistory = Boolean(value);
        debugger;
    },
    clearHistory: function(){
        localStorage.__AEL__History = '[]';
    },
    init: function(){
        var scope = this;
        function setHistory(history){
            var arr = JSON.parse(localStorage.__AEL__History);
            arr.push(history);
            localStorage.__AEL__History = JSON.stringify(arr);
            
        }
        if( !localStorage.hasOwnProperty('__AEL__isHistory') ){
            localStorage.__AEL__isHistory = true;
        }
        if( localStorage.__AEL__isHistory == 'true' && !localStorage.hasOwnProperty('__AEL__History') ){
            localStorage.__AEL__History = '[]';
            setHistory({
                url: window.location.href,
                dataTime: new Date().getTime()
            });
        }
        if( !window.hasOwnProperty('__AEL__globalVars') ){
            window.__AEL__globalVars = new Array();
            for (i in window) {
                window.__AEL__globalVars[i] = 1;
            }
        }
        function resetWindowObj(){
            for (i in window) {
                if (!window.__AEL__globalVars[i]){
                    window[i] = undefined;
                }
            }
        }
        function resetAllIntervals(){
            var interval_id = window.setInterval("", 9999); // Get a reference to the last
            for (var i = 1; i < interval_id; i++)
                    window.clearInterval(i);
            //for clearing all intervals
        }
        function AEL(href){
            scope.onLoad();
            scope.Request.onreadystatechange = function() {
                if (scope.Request.readyState == XMLHttpRequest.DONE ) {
                    switch(scope.Request.status){
                        case 200:
                            var responseText = scope.Request.responseText;
                            resetAllIntervals();
                            resetWindowObj();
                            window.stop();
                            if(localStorage.__AEL__isHistory == 'true'){
                                setHistory({
                                    url: href,
                                    dataTime: new Date().getTime()
                                });
                            }
                            var newDoc = document.open("text/html", "replace");
                            newDoc.write(responseText);
                            newDoc.close();
                            history.pushState({}, null, href);
                            break;
                        case 400:
                            scope.onNotify('There was an error 400.');
                            break;
                        case 404:
                            scope.onNotify('Page not found.');
                            break;
                        case 0:
                            scope.onNotify('Connect is aborted.');
                            break;
                        default:
                            alert();
                            break;
                    }
                }
            };

            scope.Request.open("GET", href, true);
            scope.Request.send();
        }
        
        document.onclick = function (e) {
            e = e ||  window.event;
            var element = e.target || e.srcElement;

            if (element.tagName == 'A') {
                var url = window.location.href;

                var arrOld = url.split(scope.urlSeparator);
                var arrNew = element.href.split(scope.urlSeparator);
                if(arrOld.length >= 3 && arrNew.length >= 3){
                    var oldDomain = arrOld[0] + "//" + arrOld[2];
                    var newDomain = arrNew[0] + "//" + arrNew[2];   
                    if(oldDomain != newDomain) return true;
                }else if(arrOld.length == 1 && arrNew.length == 1){
                    if(arrOld[0] != arrNew[0]) return true;
                }else{
                    if(url != element.href) return true;
                }
                AEL(element.href);
                return false; // prevent default action and stop event propagation
            }
        };
    }
}
window.AEL.init();