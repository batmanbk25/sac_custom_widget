(function () {
    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
      <style>
          fieldset {
              margin-bottom: 10px;
              border: 1px solid #afafaf;
              border-radius: 3px;
          }
          table {
              width: 100%;
          }
          input, textarea, select {
              font-family: "72",Arial,Helvetica,sans-serif;
              width: 100%;
              padding: 4px;
              box-sizing: border-box;
              border: 1px solid #bfbfbf;
          }
          input[type=checkbox] {
              width: inherit;
              margin: 6px 3px 6px 0;
              vertical-align: middle;
          }
      </style>
      <form id="form" autocomplete="off">
        <fieldset>
          <legend>General</legend>
          <table>
            <tr>
              <td><label for="serverURL">Server URL</label></td>
              <td><input id="serverURL" name="serverURL" type="text"></td>
            </tr>
            <tr>
              <td><label for="licenseKey">License Key</label></td>
              <td><input id="licenseKey" name="licenseKey" type="text"></td>
            </tr>
          </table>
        </fieldset>
        <fieldset>
          <legend>Sharing</legend>
          <table>
            <tr>
              <td><label for="type">Channel</label></td>
              <td><input id="channel" name="channel" type="channel"></td>
            </tr>
          </table>
        </fieldset>
        <button type="submit" hidden>Submit</button>
      </form>
    `;

    class BiSharingAps extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            let form = this._shadowRoot.getElementById("form");
            form.addEventListener("submit", this._submit.bind(this));
            form.addEventListener("change", this._change.bind(this));

        }

        connectedCallback() {
        }

        _submit(e) {
            e.preventDefault();
            let properties = {};
            for (let name of BiSharingAps.observedAttributes) {
                properties[name] = this[name];
            }
            this._firePropertiesChanged(properties);
            return false;
        }
        _change(e) {
            this._changeProperty(e.target.name);
        }
        _changeProperty(name) {
            let properties = {};
            properties[name] = this[name];
            this._firePropertiesChanged(properties);
        }

        _firePropertiesChanged(properties) {
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: properties
                }
            }));
        }

        get serverURL() {
            return this._getValue("serverURL");
        }
        set serverURL(value) {
            this._setValue("serverURL", value);
        }

        get licenseKey() {
            return this._getValue("licenseKey");
        }
        set licenseKey(value) {
            this._setValue("licenseKey", value);
        }

        get channel() {
            return this._getValue("channel");
        }
        set channel(value) {
            this._setValue("channel", value);
        }

        _getValue(id) {
            return this._shadowRoot.getElementById(id).value;
        }
        _setValue(id, value) {
            this._shadowRoot.getElementById(id).value = value;
        }

        _getBooleanValue(id) {
            return this._shadowRoot.getElementById(id).checked;
        }
        _setBooleanValue(id, value) {
            this._shadowRoot.getElementById(id).checked = value;
        }

        static get observedAttributes() {
            return [
                "serverURL",
                "licenseKey",
                "channel"
            ];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue != newValue) {
                this[name] = newValue;
            }
        }
    }
    customElements.define("com-biexcellence-openbi-sap-sac-sharing-aps", BiSharingAps);
})();