
//var sHost = "https://s4training.citek.vn:44335";
var sHost = "https://s420demo.citek.vn:44335"; 
var sUser = "CT.ABAPHN";
var sPassword = "1234567aA@"; 
//var sGetTokenModulePath = sHost + "/sap/ap/ui/login";
 //var sGetTokenModulePath = sHost + "/sap/opu/odata/sap/API_SALES_ORDER_SRV";
var sGetTokenModulePath = sHost + "/zsacex/getexcelcontent?template=ZXLSX_SAC_EXPORT_001";
var sUrl, sXsrfToken;
function doLogin() {  
    if (1 == 2) {

        $.ajax({
            url: sGetTokenModulePath, 
            //'Access-Control-Request-Method':'*',
            type: "GET", mode: "no-cors",
            headers: {
                //'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Authorization, Content-Type',
                "X-Requested-With": "XMLHttpRequest",
                'Authorization': 'Basic ' + btoa(sUser + ":" + sPassword),
                'x-csrf-token': 'fetch',
                'username': sUser,
                'password': sPassword
            }, 
            username: sUser,
            password: sPassword,
            crossDomain: true,
            //xhrFields: {
            //    withCredentials: true,
            //},
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Basic ' + btoa(sUser + ":" + sPassword));
            },
            success: function (response, status, xhr) {
                resolve({ response, status, xhr })
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Get Login Token call failed");
                console.log(jqXHR, textStatus, errorThrown);
            }
        })
        return;
    }
    if (1 == 2) {
        var headers = //new Headers(
        {
            'Access-Control-Allow-Origin': '*',
            //'Content-Type': 'application/json',
            //'Access- Control - Allow - Credentials': true,
                "origin": "s420demo",
            "x-requested-with": "XMLHttpRequest",
            "X-Requested-With": "XMLHttpRequest",
            'Authorization': 'Basic ' + btoa(sUser + ":" + sPassword),
            'x-csrf-token': 'fetch',
            'Username': sUser,
            'Password': sPassword
        }
            //)
            ;
        console.log(headers);
        console.log('Authorization', 'Basic ' + btoa(sUser + ":" + sPassword));

        fetch(sGetTokenModulePath, {
            method: "GET",
            //mode: "cors", 
            mode: "no-cors",
            headers: {
                'Access-Control-Allow-Origin': '*',
                "X-Requested-With": "XMLHttpRequest",
                'Authorization': 'Basic ' + btoa(sUser + ":" + sPassword),
                'x-csrf-token': 'fetch',
                'Username': sUser,
                'Password': sPassword
            },
            Username: sUser,
            Password: sPassword
            
        }).then(response => {
            if (response.ok) {
                let contentDisposition = response.headers.get("Content-Disposition");
                if (contentDisposition) {
                    return response.blob().then(blob => {
                        callback(null, contentDispositionFilenameRegExp.exec(contentDisposition)[1], blob);
                    });
                }
                return response.text().then(text => {
                    callback(null, text);
                });
            } else if (response.status == 401) {
                return response.text().then(oauthUrl => {
                    let oauthWindow = window.open(oauthUrl, "_blank", "height=500,width=500");
                    if (!oauthWindow || oauthWindow.closed) {
                        throw new Error("OAuth popup bocked");
                    }
                    return new Promise(resolve => {
                        (function checkWindow() {
                            if (!oauthWindow || oauthWindow.closed) {
                                resolve();
                            } else {
                                setTimeout(checkWindow, 1000);
                            }
                        })();
                    }).then(() => {
                        // try again after oauth
                        //this._submitExport(host, exportUrl, form, settings);
                    });
                });
            } else {
                throw new Error(response.status + ": " + response.statusText);
            }
        }
        );
        return;
    }
    if (1 == 2) {
        window.open(url, "_blank");
        return;

    }

    // handle response types
    let callback = (error, filename, blob) => {
        if (error) {
            this._serviceMessage = error;
            this.dispatchEvent(new CustomEvent("onError", {
                detail: {
                    error: error,
                    settings: settings
                }
            }));

            console.error("Export failed:", error);
        } else if (filename) {
            if (filename.indexOf("E:") === 0) {
                callback(new Error(filename)); // error...
                return;
            }

            this._serviceMessage = "Export has been produced";
            this.dispatchEvent(new CustomEvent("onReturn", {
                detail: {
                    filename: filename,
                    settings: settings
                }
            }));

            if (blob) { // download blob
                let downloadUrl = URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.download = filename;
                a.href = downloadUrl;
                document.body.appendChild(a);
                a.click();

                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(downloadUrl);
                }, 0);
            } else if (filename.indexOf("I:") !== 0) { // download via filename and not scheduled
                let downloadUrl = host + "/sac/download.html?FILE=" + encodeURIComponent(filename);

                window.open(downloadUrl, "_blank");
            }
        }
    };
    //alert('Logging in');
     var xhr = new XMLHttpRequest();
 
    // Making our connection  
    var url = sGetTokenModulePath;
    //xhr.open("GET", url, true); 

    //xhr.open("GET", url); 
    xhr.open("GET", url, false, sUser, sPassword); 
    var headers = {
        'Access-Control-Allow-Origin': '*',
        //'Authorization': { username: "CT.TUAN", password: "Bb123456!@#" }, 
        'Authorization': 'Basic ' + btoa(sUser + ":" + sPassword),
        'x-csrf-token': 'fetch' 
    }
    //xhr.setRequestHeader('Access-Control-Allow-Origin', 'https://localhost:7110' );
    xhr.setRequestHeader('Access-Control-Allow-Origin', 'https://localhost:7110; https://s4training.citek.vn:44335' );
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*' );

    //xhr.setRequestHeader('Authorization', make_base_auth("CT.TUAN", "Bb123456!@#"));
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(sUser + ":" + sPassword));
    xhr.setRequestHeader( 'sec-fetch-mode', "no-cors"); 
    xhr.setRequestHeader( 'mode', "no-cors"); 
    //xhr.setRequestHeader(headers); 

    console.log(xhr.headers);
    // function execute after request is successful 
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    }
    // Sending our request 
    xhr.send();
    console.log(xhr.getAllResponseHeaders());
    
    return 

};

  
