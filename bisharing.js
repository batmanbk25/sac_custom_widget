(function () {
    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
      <style>
      </style>
      <div id="sharing_div" name="sharing_div" class="openbihideonprint">
         <form id="form" method="post" accept-charset="utf-8" action="">
            <input id="export_settings_json" name="bie_openbi_export_settings_json" type="hidden">
        </form>
      </div>
    `;

    class BiSharing extends HTMLElement {

        constructor() {
            super();

            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            this._id = createGuid();

            this._shadowRoot.querySelector("#sharing_div").id = this._id + "_sharing_div";
            this._shadowRoot.querySelector("#form").id = this._id + "_form";

            this.settings = this._shadowRoot.querySelector("#export_settings_json");
            this.settings.id = this._id + "_export_settings_json";

            this._serviceMessage = "";
            this._response = {};
            this._channel = "";
            this._connectParams = {};

            this._sharing_settings = {};
            this._sharing_settings.dashboard = "";
            this._sharing_settings.pageid = "";
            this._sharing_settings.requestid = "";
            this._sharing_settings.mastersys = "";
            this._sharing_settings.client_type = "";
            this._sharing_settings.client_version = "";
            this._sharing_settings.title = "";
            this._sharing_settings.appid = "";
            this._sharing_settings.urlprefix = "";
            this._sharing_settings.cookie = "";
            this._sharing_settings.user = "";
            this._sharing_settings.lng = "";
            this._sharing_settings.version = "";
            this._sharing_settings.URL = "";

            this._sharing_settings.license = "";
            this._sharing_settings.server_urls = "";

            this._sharing_settings.publish_mode = "MAIL";
            this._sharing_settings.mail_from = "";
            this._sharing_settings.mail_to = "";
            this._sharing_settings.mail_subject = "";
            this._sharing_settings.mail_body = "";
            this._sharing_settings.array_text = "";

            this._updateSettings();

            // $.getScript("https://js.live.net/v7.2/OneDrive.js");
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            if ("designMode" in changedProperties) {
                this._designMode = changedProperties["designMode"];
            }
        }

        // SETTINGS

        getServerUrl() {
            return this.serverURL;
        }
        setServerUrl(value) {
            this._setValue("serverURL", value);
        }

        get serverURL() {
            return this._sharing_settings.server_urls;
        }
        set serverURL(value) {
            this._sharing_settings.server_urls = value;
            this._updateSettings();
        }

        getLicenseKey() {
            return this.licenseKey;
        }
        setLicenseKey(value) {
            this._setValue("licenseKey", value);
        }

        get licenseKey() {
            return this._sharing_settings.license;
        }
        set licenseKey(value) {
            this._sharing_settings.license = value;
            this._updateSettings();
        }

        getChannel() {
            return this.channel;
        }
        setChannel(value) {
            this._setValue("channel", value);
        }

        get channel() {
            return this._channel;
        }
        set channel(value) {
            this._channel = value;
        }

        // METHODS

        _updateSettings() {
            this.settings.value = JSON.stringify(this._sharing_settings);
        }

        _setValue(name, value) {
            this[name] = value;

            let properties = {};
            properties[name] = this[name];
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: properties
                }
            }));
        }

        addConnectionParameter(name, value) {
            this._connectParams[name] = value;
            this._sharing_settings.publish_mode = this._channel + "[" + JSON.stringify(this._connectParams) + "]";
            this._updateSettings();
        }

        clearConnectionParameters() {
            this._connectParams = {};
            this._sharing_settings.publish_mode = this._channel;
            this._updateSettings();
        }

        getServiceMessage() {
            return this._serviceMessage;
        }

        getFileName() {
            return this._response.name;
        }

        getFileUrl() {
            return this._response.webUrl;
        }

        selectToShare() {
            // references: 
            // https://docs.microsoft.com/en-us/onedrive/developer/controls/file-pickers/js-v72/save-file?view=odsp-graph-online
            // https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_createlink?view=odsp-graph-online

            this._serviceMessage = "";
            this._response = {};

            this.dispatchEvent(new CustomEvent("onSend", {
                detail: {
                    settings: this._sharing_settings
                }
            }));

            const onMessage = event => {
                if (event.data.bisharing != null) {
                    if (event.data.success) {
                        this._serviceMessage = event.data.value[0].webUrl;
                        this._response = event.data.value[0];
                        this.dispatchEvent(new CustomEvent("onSuccess", {
                            detail: {
                                settings: this._sharing_settings
                            }
                        }));
                    } else {
                        this._serviceMessage = "Action aborted.";
                        this.dispatchEvent(new CustomEvent("onError", {
                            detail: {
                                settings: this._sharing_settings
                            }
                        }));

                    }
                    window.removeEventListener("message", onMessage);
                }
            };

            window.addEventListener("message", onMessage);

            let liframe = document.createElement("iframe");
            liframe.setAttribute('id', this._id + "_sharing_iframe");
            liframe.setAttribute('name', "sharing_iframe");
            liframe.setAttribute('style', "display:none;");
            liframe.setAttribute('src', this._sharing_settings.server_urls + "/export_resources/bisharing.html" +
                "?clientId=" + encodeURIComponent(this._connectParams["clientId"]) +
                "&link=" + encodeURIComponent(this._connectParams["entryLink"]) +
                "&navigate=" + encodeURIComponent(this._connectParams["showNavigation"]) +
                "&origin=" + encodeURIComponent(location.origin));
            this._shadowRoot.appendChild(liframe);

            //var odOptions = {
            //    clientId: this._connectParams["clientId"],
            //    action: "share",
            //    multiSelect: true,e
            //    advanced: {
            //        createLinkParameters: { type: "view", scope: "organization" } // anonymous
            //    },
            //    success: response => {
            //        /* success handler */

            //        //{
            //        //  "value": [
            //        //    {
            //        //      "@microsoft.graph.downloadUrl": "https://contoso-my.sharepoint.com/download.aspx?guid=1231231231a",
            //        //      "webUrl": "https://cotoso-my.sharepoint.com/personal/user_contoso_com/documents/document1.docx",
            //        //    }
            //        //  ],
            //        //}
            //        this._serviceMessage = response.value[0].webUrl;
            //        this.dispatchEvent(new CustomEvent("onSuccess", {
            //            detail: {
            //                settings: settings
            //            }
            //        }));

            //    },
            //    cancel: () => {
            //        /* cancel handler */
            //        this.dispatchEvent(new CustomEvent("onSuccess", {
            //            detail: {
            //                settings: settings
            //            }
            //        }));

            //    },
            //    error: error => {
            //        /* error handler */
            //        this.dispatchEvent(new CustomEvent("onError", {
            //            detail: {
            //                settings: settings
            //            }
            //        }));

            //    }
            //};

            // OneDrive.open(odOptions);

        }

        uploadToShare() {
            let settings = JSON.parse(JSON.stringify(this._sharing_settings));

            setTimeout(() => {
                this._upload(settings);
            }, 200);
        }

        _upload(settings) {
            if (this._designMode) {
                return false;
            }

            // select file
            // todo

            settings.URL = location.protocol + "//" + location.host;
            settings.dashboard = location.href;
            settings.title = document.title;
            settings.cookie = document.cookie;

            // try detect runtime settings
            if (window.sap && sap.fpa && sap.fpa.ui && sap.fpa.ui.infra) {
                if (sap.fpa.ui.infra.common) {
                    let context = sap.fpa.ui.infra.common.getContext();

                    settings.appid = getAppId(context);

                    let user = context.getUser();
                    settings.sac_user = user.getUsername();

                    if (settings.lng == "") {
                        settings.lng = context.getLanguage();
                    }
                }
                if (sap.fpa.ui.infra.service && sap.fpa.ui.infra.service.AjaxHelper) {
                    settings.tenant_URL = sap.fpa.ui.infra.service.AjaxHelper.getTenantUrl(false); // true for PUBLIC_FQDN
                }
            }

            let lupload = new sap.m.UploadCollection(
                {

                    uploadUrl: settings.server_urls + "/upload.html",
                    beforeUploadStarts: event => {
                        event.getParameters().addHeaderParameter(new sap.m.UploadCollectionParameter({ name: "bie_openbi_sharing_settings_json", value: encodeURIComponent(JSON.stringify(settings)) }));
                        event.getParameters().addHeaderParameter(new sap.m.UploadCollectionParameter({ name: "filename", value: encodeURIComponent(event.getParameter("fileName")) }));

                        this.dispatchEvent(new CustomEvent("onSend", {
                            detail: {
                                settings: settings
                            }
                        }));
                    },
                    uploadComplete: event => {
                        if (event.getParameters().mParameters.status == "200") {
                            this._serviceMessage = event.getParameters().mParameters.responseRaw;
                            if (this._serviceMessage.indexOf("</script>") > 0) {
                                this._serviceMessage = this._serviceMessage.split("</script>")[1]
                            }

                            if (this._serviceMessage.indexOf("I:") > -1) {
                                this._serviceMessage = this._serviceMessage.replace("I:", "");

                                this.dispatchEvent(new CustomEvent("onSuccess", {
                                    detail: {
                                        settings: settings
                                    }
                                }));
                            } else {
                                this._serviceMessage = this._serviceMessage.replace("E:", "");

                                this.dispatchEvent(new CustomEvent("onError", {
                                    detail: {
                                        settings: settings
                                    }
                                }));
                            }

                        } else {
                            this.dispatchEvent(new CustomEvent("onError", {
                                detail: {
                                    settings: settings
                                }
                            }));

                        }
                        ldialog.close();
                    },
                    uploadTerminated: event => {
                        this.dispatchEvent(new CustomEvent("onSuccess", {
                            detail: {
                                settings: settings
                            }
                        }));
                    }
                }
            );

            let ldialog = new sap.m.Dialog({
                title: "Upload files",
                endButton: new sap.m.Button({
                    text: "Close",
                    press: () => {
                        ldialog.close();
                    }
                }),
                content: lupload
            });

            ldialog.open();
        }

        _submitUpload(host, exportUrl, form, settings) {

            this._serviceMessage = "";

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

                    console.error("Upload failed:", error);
                } else if (filename) {
                    if (filename.indexOf("E:") === 0) {
                        callback(new Error(filename)); // error...
                        return;
                    }

                    this._serviceMessage = "File has been uploaded";
                    this.dispatchEvent(new CustomEvent("onSuccess", {
                        detail: {
                            filename: filename,
                            settings: settings
                        }
                    }));

                }
            };

            if (exportUrl.indexOf(location.protocol) == 0 || exportUrl.indexOf("https:") == 0) { // same protocol => use fetch?
                fetch(exportUrl, {
                    method: "POST",
                    mode: "cors",
                    body: new FormData(form),
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    }
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
                    } else {
                        throw new Error(response.status + ": " + response.statusText);
                    }
                }).catch(reason => {
                    callback(reason);
                });
            } else { // use form with blank target...
                form.action = exportUrl;
                form.target = "_blank";
                form.method = "POST";
                form.acceptCharset = "utf-8";
                this._shadowRoot.appendChild(form);

                form.submit();

                form.remove();

                callback(null, "I:Upload running in separate tab");
            }
        }

    }
    customElements.define("com-biexcellence-openbi-sap-sac-sharing", BiSharing);

    // UTILS

    const contentDispositionFilenameRegExp = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i;

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function getAppId(context) {
        let app = (context || sap.fpa.ui.infra.common.getContext()).getInternalAppArguments();
        return app && (app.appId /* application */ || app.resource_id /* story */);
    }

})();
