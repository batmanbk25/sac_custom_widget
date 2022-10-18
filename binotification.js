(function () {
    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
      <style>
      </style>
      <div id="notification_div" name="notification_div" class="openbihideonprint">
         <form id="form" method="post" accept-charset="utf-8" action="">
            <input id="export_settings_json" name="bie_openbi_export_settings_json" type="hidden">
        </form>
      </div>
    `;

    class BiNotification extends HTMLElement {

        constructor() {
            super();

            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            this._id = createGuid();

            this._shadowRoot.querySelector("#notification_div").id = this._id + "_notification_div";
            this._shadowRoot.querySelector("#form").id = this._id + "_form";

            this.settings = this._shadowRoot.querySelector("#export_settings_json");
            this.settings.id = this._id + "_export_settings_json";

            this._serviceMessage = "";

            this._notification_settings = {};
            this._notification_settings.dashboard = "";
            this._notification_settings.pageid = "";
            this._notification_settings.requestid = "";
            this._notification_settings.mastersys = "";
            this._notification_settings.client_type = "";
            this._notification_settings.client_version = "";
            this._notification_settings.title = "";
            this._notification_settings.appid = "";
            this._notification_settings.urlprefix = "";
            this._notification_settings.cookie = "";
            this._notification_settings.user = "";
            this._notification_settings.lng = "";
            this._notification_settings.version = "";
            this._notification_settings.URL = "";

            this._notification_settings.license = "";
            this._notification_settings.server_urls = "";

            this._notification_settings.publish_mode = "MAIL";
            this._notification_settings.mail_from = "";
            this._notification_settings.mail_to = "";
            this._notification_settings.mail_subject = "";
            this._notification_settings.mail_body = "";
            this._notification_settings.array_text = "";

            this._updateSettings();
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
            return this._notification_settings.server_urls;
        }
        set serverURL(value) {
            this._notification_settings.server_urls = value;
            this._updateSettings();
        }

        getLicenseKey() {
            return this.licenseKey;
        }
        setLicenseKey(value) {
            this._setValue("licenseKey", value);
        }

        get licenseKey() {
            return this._notification_settings.license;
        }
        set licenseKey(value) {
            this._notification_settings.license = value;
            this._updateSettings();
        }

        getType() {
            return this.type;
        }
        setType(value) {
            this._setValue("type", value);
        }

        get type() {
            return this._notification_settings.publish_mode;
        }
        set type(value) {
            this._notification_settings.publish_mode = value;
            this._updateSettings();
        }

        getSender() {
            return this._notification_settings.mail_from;
        }
        setSender(value) {
            this._setValue("sender", value);
        }

        get sender() {
            return this._notification_settings.mail_from;
        }
        set sender(value) {
            this._notification_settings.mail_from = value;
            this._updateSettings();
        }

        getNotificationBody() {
            return this.notificationBody;
        }
        setNotificationBody(value) {
            this._setValue("notificationBody", value);
        }

        get notificationBody() {
            return this._notification_settings.mail_body;
        }
        set notificationBody(value) {
            this._notification_settings.mail_body = value;
            this._updateSettings();
        }

        // METHODS

        _updateSettings() {
            this.settings.value = JSON.stringify(this._notification_settings);
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

        addCustomText(name, value) {
            if (!this._notification_settings.array_text) {
                this._notification_settings.array_text = [];
            }
            this._notification_settings.array_text.push({ "name": name, "value": value });
            this._updateSettings();
        }

        clearCustomTexts() {
            this._notification_settings.array_text = "";
            this._updateSettings();
        }

        getServiceMessage() {
            return this._serviceMessage;
        }

        sendNotification(to, cc, subject) {
            let settings = JSON.parse(JSON.stringify(this._notification_settings));

            setTimeout(() => {
                this._sendNotification(settings, to, cc, subject);
            }, 200);
        }

        _sendNotification(settings, to, cc, subject) {
            if (this._designMode) {
                return false;
            }

            settings.mail_to = JSON.stringify([{
                address: to.join(";"),
                mailcc: cc.join(";")
            }]);

            settings.mail_subject = subject;

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

            this.dispatchEvent(new CustomEvent("onSend", {
                detail: {
                    settings: settings
                }
            }));

            this._createNotificationForm(settings, null);
        }

        _createNotificationForm(settings, content) {
            let form = document.createElement("form");

            let settingsEl = form.appendChild(document.createElement("input"));
            settingsEl.name = "bie_openbi_export_settings_json";
            settingsEl.type = "hidden";
            settingsEl.value = JSON.stringify(settings);

            let host = settings.server_urls;
            let url = host + "/notification.html";

            this._submitNotification(host, url, form, settings);
        }

        _submitNotification(host, exportUrl, form, settings) {

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

                    console.error("Notification failed:", error);
                } else if (filename) {
                    if (filename.indexOf("E:") === 0) {
                        callback(new Error(filename)); // error...
                        return;
                    }

                    this._serviceMessage = "Notfication has been sent";
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

                callback(null, "I:Notification running in separate tab");
            }
        }

    }
    customElements.define("com-biexcellence-openbi-sap-sac-notification", BiNotification);

    // UTILS

    const contentDispositionFilenameRegExp = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i;

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function getAppId(context) {
        let app = (context || sap.fpa.ui.infra.common.getContext()).getInternalAppArguments(); // sap.fpa.ui.story.Utils.getInternalAppArguments()
        return app && (app.appId /* application */ || app.resource_id /* story */);
    }

})();