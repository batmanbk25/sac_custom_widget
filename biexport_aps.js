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
                  font-family: "72","72full",Arial,Helvetica,sans-serif;
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
              <legend>biExport Service</legend>
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
              <legend>PDF</legend>
              <table>
                <tr>
                  <td><label for="pdfTemplate">Template</label></td>
                  <td><input id="pdfTemplate" name="pdfTemplate" type="text"></td>
                </tr>
                <tr>
                  <td colspan="2"><slot name="pdf_PageSections"></slot></td>
                </tr>
                <tr>
                  <td><label for="pdf_SelectedWidgets">CONTENT Widgets</label></td>
                  <td><slot width="100px" name="pdf_SelectedWidgets"></slot></td>
                </tr>
              </table>
            </fieldset>
            <fieldset>
              <legend>Word</legend>
              <table>
                <tr>
                  <td><label for="docTemplate">Template</label></td>
                  <td><input id="docTemplate" name="docTemplate" type="text"></td>
                </tr>
                <tr>
                  <td><label for="doc_SelectedWidgets">CONTENT Widgets</label></td>
                  <td><slot name="doc_SelectedWidgets"></slot></td>
                </tr>
              </table>
            </fieldset>
            <fieldset>
              <legend>PowerPoint</legend>
              <table>
                <tr>
                  <td><label for="pptTemplate">Template</label></td>
                  <td><input id="pptTemplate" name="pptTemplate" type="text"></td>
                </tr>
                <tr>
                  <td><label for="pptSeparate">Clone CONTENT Slide</label></td>
                  <td><input id="pptSeparate" name="pptSeparate" type="checkbox"></td>
                </tr>
                <tr>
                  <td><label for="ppt_SelectedWidgets">CONTENT Widgets</label></td>
                  <td><slot name="ppt_SelectedWidgets"></slot></td>
                </tr>
              </table>
            </fieldset>
            <fieldset>
              <legend>Images</legend>
              <table>
                <tr>
                  <td><label for="png_SelectedWidgets">Widgets</label></td>
                  <td><slot name="png_SelectedWidgets"></slot></td>
                </tr>
              </table>
            </fieldset>
            <fieldset>
              <legend>Excel</legend>
              <table>
                <tr>
                  <td><label for="xlsTemplate">Template</label></td>
                  <td><input id="xlsTemplate" name="xlsTemplate" type="text"></td>
                </tr>
                <tr>
                  <td><label for="xls_SelectedWidgets">CONTENT Widgets</label></td>
                  <td><slot name="xls_SelectedWidgets"></slot></td>
                </tr>
              </table>
            </fieldset>
            <fieldset>
              <legend>General</legend>
              <table>
                <tr>
                  <td><label for="parseCss">Parse CSS</label></td>
                  <td><input id="parseCss" name="parseCss" type="checkbox"></td>
                </tr>
                <tr>
                  <td><label for="screenWidth">Static Width</label></td>
                  <td><input id="screenWidth" name="screenWidth" type="number" step="1"></td>
                </tr>
                <tr>
                  <td><label for="screenHeight">Static Height</label></td>
                  <td><input id="screenHeight" name="screenHeight" type="number" step="1"></td>
                </tr>
                <tr>
                  <td><label for="exportLanguage">Language</label></td>
                  <td><input id="exportLanguage" name="exportLanguage" type="text" placeholder="Using client language if emtpy"></td>
                </tr>
                <tr>
                  <td><label for="biAnalyticsDocument">biAnalytics Document</label></td>
                  <td><input id="biAnalyticsDocument" name="biAnalyticsDocument" type="checkbox"></td>
                </tr>
                <tr>
                  <td><label for="tables_SelectedWidgets">Retrieve add. data</label></td>
                  <td><slot name="tables_SelectedWidgets"></slot></td>
                </tr>
              </table>
            </fieldset>

            <fieldset>
              <legend>Publishing</legend>
              <table>
                <tr>
                  <td><label for="publishMode">Publish Mode</label></td>
                  <td><input id="publishMode" name="publishMode" type="text"></td>
                </tr>
                <tr>
                  <td><label for="publishSync">Publish Sync</label></td>
                  <td><input id="publishSync" name="publishSync" type="checkbox"></td>
                </tr>
                <tr>
                  <td><label for="filename">Filename</label></td>
                  <td><input id="filename" name="filename" type="text"></td>
                </tr>
                <tr>
                  <td><label for="mailFrom">Mail From</label></td>
                  <td><input id="mailFrom" name="mailFrom" type="text"></td>
                </tr>
                <tr>
                  <td><label for="mailTo">Mail To</label></td>
                  <td><input id="mailTo" name="mailTo" type="text"></td>
                </tr>
                <tr>
                  <td><label for="mailSubject">Mail Subject</label></td>
                  <td><input id="mailSubject" name="mailSubject" type="text"></td>
                </tr>
                <tr>
                  <td><label for="mailBody">Mail Body</label></td>
                  <td><textarea id="mailBody" name="mailBody"></textarea></td>
                </tr>
              </table>
            </fieldset>
            <fieldset>
              <legend>Background Execution</legend>
              <table>
                <tr hidden>
                  <td><label for="tenantUrl">Tenant URL</label></td>
                  <td><input id="tenantUrl" name="tenantUrl" type="text" readonly></td>
                </tr>
                <tr hidden>
                  <td><label for="oauthId">OAuth Client</label></td>
                  <td><select id="oauthId" name="oauthId"><option value=""> - </option></select></td>
                </tr>
                <tr>
                  <td><label for="oauthClientId">OAuth Client Id</label></td>
                  <td><input id="oauthClientId" name="oauth" type="text"></td>
                </tr>
                <tr>
                  <td><label for="oauthClientSecret">OAuth Client Secret</label></td>
                  <td><input id="oauthClientSecret" name="oauth" type="password"></td>
                </tr>
                <tr>
                  <td><label for="oauthClientRedirectURL">OAuth Client Redirect URL</label></td>
                  <td><input id="oauthClientRedirectURL" name="oauth" type="text"></td>
                </tr>
                <tr>
                  <td><label for="oauthAuthorizationURL">OAuth Authorization URL</label></td>
                  <td><input id="oauthAuthorizationURL" name="oauth" type="text"></td>
                </tr>
                <tr>
                  <td><label for="oauthTokenURL">OAuth Token URL</label></td>
                  <td><input id="oauthTokenURL" name="oauth" type="text"></td>
                </tr>
                <tr>
              </table>
            </fieldset>
            <fieldset>
              <legend>Display</legend>
              <table>
                <tr>
                  <td><label for="showTexts">Show Texts</label></td>
                  <td><input id="showTexts" name="showTexts" type="checkbox"></td>
                 </tr>
                <tr>
                  <td><label for="showIcons">Show Icons</label></td>
                  <td><input id="showIcons" name="showIcons" type="checkbox"></td>
                </tr>
                <tr>
                  <td><label for="showComponentSelector">Show Component Selector</label></td>
                  <td><input id="showComponentSelector" name="showComponentSelector" type="checkbox"></td>
                </tr>
                <tr>
                  <td><label for="showViewSelector">Show View Selector</label></td>
                  <td><input id="showViewSelector" name="showViewSelector" type="checkbox"></td>
                </tr>
                <tr>
                  <td><label for="enablePpt">Enable PowerPoint</label></td>
                  <td><input id="enablePpt" name="enablePpt" type="checkbox"></td>
                </tr>
                <tr>
                  <td><label for="enableDoc">Enable Word</label></td>
                  <td><input id="enableDoc" name="enableDoc" type="checkbox"></td>
                </tr>
                <tr>
                  <td><label for="enablePdf">Enable PDF</label></td>
                  <td><input id="enablePdf" name="enablePdf" type="checkbox"></td>
                </tr>
                <tr>
                  <td><label for="enableXls">Enable Excel</label></td>
                  <td><input id="enableXls" name="enableXls" type="checkbox"></td>
                </tr>
                <tr>
                  <td><label for="enableCsv">Enable CSV</label></td>
                  <td><input id="enableCsv" name="enableCsv" type="checkbox"></td>
                </tr>
                <tr>
                  <td><label for="enablePng">Enable Images</label></td>
                  <td><input id="enablePng" name="enablePng" type="checkbox"></td>
                </tr>
              </table>
            </fieldset>
            <button type="submit" hidden>Submit</button>
          </form>
        `;

    class BiExportAps extends HTMLElement {
        
        _getWidgetModel() {
            let tableComponents = this["tablesSelectedWidgets"] ? JSON.parse(this["tablesSelectedWidgets"]) : [];
            let pdfVisibleComponents = this["pdfSelectedWidgets"] ? JSON.parse(this["pdfSelectedWidgets"]) : [];
            let pptVisibleComponents = this["pptSelectedWidgets"] ? JSON.parse(this["pptSelectedWidgets"]) : [];
            let xlsVisibleComponents = this["xlsSelectedWidgets"] ? JSON.parse(this["xlsSelectedWidgets"]) : [];
            let docVisibleComponents = this["docSelectedWidgets"] ? JSON.parse(this["docSelectedWidgets"]) : [];
            let pngVisibleComponents = this["pngSelectedWidgets"] ? JSON.parse(this["pngSelectedWidgets"]) : [];
            let allComponents = biExportGetMetadata({}).components;
            let components = [];
            for (let componentId in allComponents) {
                let component = allComponents[componentId];
                component.id = componentId;
                component.tablesSelectedWidgets = false;
                component.pdfSelectedWidgets = false;
                component.xlsSelectedWidgets = false;
                component.docSelectedWidgets = false;
                component.pptSelectedWidgets = false;
                component.pngSelectedWidgets = false;
                if (tableComponents.length > 0 && !tableComponents.some(v => v.component == component.name && v.isExcluded)) {
                    component.tablesSelectedWidgets = true;
                }
                if (pdfVisibleComponents.length > 0 && !pdfVisibleComponents.some(v => v.component == component.name && v.isExcluded)) {
                    component.pdfSelectedWidgets = true;
                }
                if (pptVisibleComponents.length > 0 && !pptVisibleComponents.some(v => v.component == component.name && v.isExcluded)) {
                    component.pptSelectedWidgets = true;
                }
                if (docVisibleComponents.length > 0 && !docVisibleComponents.some(v => v.component == component.name && v.isExcluded)) {
                    component.docSelectedWidgets = true;
                }
                if (xlsVisibleComponents.length > 0 && !xlsVisibleComponents.some(v => v.component == component.name && v.isExcluded)) {
                    component.xlsSelectedWidgets = true;
                }
                if (pngVisibleComponents.length > 0 && !pngVisibleComponents.some(v => v.component == component.name && v.isExcluded)) {
                    component.pngSelectedWidgets = true;
                }
                components.push(component);
            }

            let model = new sap.ui.model.json.JSONModel(components);
            model.setSizeLimit(9999);

            return model;
        }

        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            let form = this._shadowRoot.getElementById("form");
            form.addEventListener("submit", this._submit.bind(this));
            form.addEventListener("change", this._change.bind(this));

            // visible components - model filters
            let modelFilters = {};
            modelFilters["Tables"] = [new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.EQ, "table")];
            modelFilters["Charts"] = [new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.EQ, "viz")];
            modelFilters["Layouts"] = [new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.EQ, "pagebook"), new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.EQ, "panel"), new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.EQ, "flowpanel"), new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.EQ, "tabstrip")];
            modelFilters["Texts"] = [new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.EQ, "textWidget"), new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.EQ, "inputField"), new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.EQ, "textArea")];
            modelFilters["Filters"] = [new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.EQ, "filterLine"), new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.EQ, "dropdownBox")];
            modelFilters["Others"] = new sap.ui.model.Filter({
                filters: [
                    new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.NE, "sdk_com_biexcellence_openbi_sap_sac_export__0"),
                    new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.NE, "pagebook"), new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.NE, "panel"), new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.NE, "flowpanel"), new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.NE, "tabstrip"),
                    new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.NE, "textWidget"), new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.NE, "inputField"), new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.NE, "textArea"),
                    new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.NE, "filterLine"), new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.NE, "dropdownBox"),
                    new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.NE, "table"), new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.NE, "viz")
                ],
                and: true
            });

            // visible components - UI elements
            this.filters = [];
            ["tables_SelectedWidgets", "pdf_SelectedWidgets", "png_SelectedWidgets", "ppt_SelectedWidgets", "doc_SelectedWidgets", "xls_SelectedWidgets"].forEach(slotId => {
                let id = slotId.replace("_", "");

                let filter = new sap.m.FacetFilter({
                    showSummaryBar: true,
                    showReset: false,
                    showPersonalization: true,
                    type: sap.m.FacetFilterType.Light,
                    showPopoverOKButton: true
                });

                let filterTemplate;
                switch (id) {
                    case "tablesSelectedWidgets":
                        filterTemplate = new sap.m.FacetFilterItem({
                            key: "{name}",
                            text: "{name}",
                            selected: "{tablesSelectedWidgets}"
                        });
                        break;
                    case "pdfSelectedWidgets":
                        filterTemplate = new sap.m.FacetFilterItem({
                            key: "{name}",
                            text: "{name}",
                            selected: "{pdfSelectedWidgets}"
                        });
                        break;
                    case "pptSelectedWidgets":
                        filterTemplate = new sap.m.FacetFilterItem({
                            key: "{name}",
                            text: "{name}",
                            selected: "{pptSelectedWidgets}"
                        });
                        break;
                    case "docSelectedWidgets":
                        filterTemplate = new sap.m.FacetFilterItem({
                            key: "{name}",
                            text: "{name}",
                            selected: "{docSelectedWidgets}"
                        });
                        break;
                    case "pngSelectedWidgets":
                        filterTemplate = new sap.m.FacetFilterItem({
                            key: "{name}",
                            text: "{name}",
                            selected: "{pngSelectedWidgets}"
                        });
                        break;
                    case "xlsSelectedWidgets":
                        filterTemplate = new sap.m.FacetFilterItem({
                            key: "{name}",
                            text: "{name}",
                            selected: "{xlsSelectedWidgets}"
                        });
                }

                // split components by filter 
                ["Tables", "Charts", "Layouts", "Texts", "Filters", "Others"].forEach(typeGroup => {
                    // for tables Selector, only support Tables (to add hidden cells) and Charts (to support native charts
                    if ((id == "tablesSelectedWidgets") && (typeGroup != "Tables") && (typeGroup != "Charts")) {
                        return;
                    }

                    let filterList = new sap.m.FacetFilterList({
                        title: typeGroup,
                        items: {
                            path: "/",
                            sorter: [{
                                path: id,
                                descending: true
                            }, {
                                path: "name",
                                descending: false
                            }],
                            filters: modelFilters[typeGroup],
                            template: filterTemplate
                        },
                        listOpen: oEvent => {
                            let list = oEvent.getSource();

                            // check model changes - this could be performance optimized by just checking the elements that have been changed in the dashboards
                            list.setModel(this._getWidgetModel());
                        },
                        listClose: oEvent => {
                            let list = oEvent.getSource();
                            let components = list.getModel().getData();

                            // set visible components 
                            let visibleComponents = [];
                            for (let componentId in components) {
                                
                                visibleComponents.push({
                                    component: components[componentId].name,
                                    isExcluded: !components[componentId][id],
                                    id: components[componentId].id
                                });
                            }

                            // set parameter
                            let value = "";
                            if (visibleComponents.some(v => v.isExcluded) && visibleComponents.some(v => !v.isExcluded)) {
                                value = JSON.stringify(visibleComponents);
                            }

                            let properties = {};
                            this[id] = properties[id] = value;
                            this._firePropertiesChanged(properties);
                        }

                    });

                    filter.addList(filterList);
                    
                });

                let excludeSlot = document.createElement("div");
                excludeSlot.style.width = "210px";
                excludeSlot.slot = slotId;
                this.appendChild(excludeSlot);

                filter.addStyleClass("sapUiSizeCompact");
                filter.placeAt(excludeSlot);
                this.filters.push(filter);
            });

            // page section HTML
            let slotId = "pdf_PageSections";
            let idHeader = "pdfHeader";
            let idFooter = "pdfFooter";
            let idOrientation = "pdfOrient";

            let link = new sap.m.Link({
                text: "PDF Sections...",
                press: oEvent => {

                    let orientDropdown = new sap.m.ComboBox({
                        items: [new sap.ui.core.ListItem("P", {
                            text: "Portrait"
                        }), new sap.ui.core.ListItem("L", {
                            text: "Landscape"
                        })],
                        selectedItemId: this[idOrientation]
                    });

                    let textEditorHeader = new sap.ui.richtexteditor.RichTextEditor({
                        editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
                        width: "100%",
                        height: "100%",
                        customToolbar: true,
                        showGroupFont: true,
                        showGroupLink: true,
                        showGroupInsert: true,
                        value: this[idHeader],
                        ready: oEvent => {
                        },
                        change: oEvent => {
                        }
                    });

                    let textEditorFooter = new sap.ui.richtexteditor.RichTextEditor({
                        editorType: sap.ui.richtexteditor.EditorType.TinyMCE4,
                        width: "100%",
                        height: "100%",
                        customToolbar: true,
                        showGroupFont: true,
                        showGroupLink: true,
                        showGroupInsert: true,
                        value: this[idFooter],
                        ready: oEvent => {
                        },
                        change: oEvent => {
                        }
                    });

                    let dialog = new sap.m.Dialog({
                        title: "Edit Pdf Section",
                        contentWidth: "800px",
                        contentHeight: "500px",
                        draggable: true,
                        resizable: true,
                        content: [
                            orientDropdown, textEditorHeader, textEditorFooter
                        ],
                        beginButton: new sap.m.Button({
                            text: "Submit",
                            press: () => {
                                let properties = {};
                                let value = textEditorHeader.getValue();
                                this[idHeader] = properties[idHeader] = value;
                                value = textEditorFooter.getValue();
                                this[idFooter] = properties[idFooter] = value;
                                value = orientDropdown.getSelectedItemId();
                                this._firePropertiesChanged(properties);
                                dialog.close();
                            }
                        }),
                        endButton: new sap.m.Button({
                            text: "Cancel",
                            press: () => {
                                dialog.close();
                            }
                        }),
                        beforeOpen: () => {
                        },
                        afterClose: () => {
                            // textEditor.destroy();
                            dialog.destroy();
                        }
                    });

                    dialog.open();

                }
            });

            let excludeSlot = document.createElement("div");
            excludeSlot.slot = slotId;
            this.appendChild(excludeSlot);

            link.addStyleClass("sapUiSizeCompact");
            link.placeAt(excludeSlot);

        }

        onCustomWidgetAfterUpdate() {
        }
        
        connectedCallback() {
            let model = this._getWidgetModel();
            this.filters.forEach(filter => {
                filter.getLists().forEach(filterList => {
                    filterList.setModel(model);
                });
            });

            // try to display tenant URL
            if (window.sap && sap.fpa && sap.fpa.ui && sap.fpa.ui.infra && sap.fpa.ui.infra.service && sap.fpa.ui.infra.service.AjaxHelper) {
                var tenantUrl = this._shadowRoot.getElementById("tenantUrl")
                tenantUrl.value = sap.fpa.ui.infra.service.AjaxHelper.getTenantUrl(false); // true for PUBLIC_FQDN
                tenantUrl.closest("tr").hidden = false;
            }

            // try to load oauth info
            fetch("/oauthservice/api/v1/oauthclient?tenant=" + window.TENANT).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Failed to get oauth clients: " + response.status)
            }).then(oauthClients => {
                let oauthSelect = this._shadowRoot.getElementById("oauthId");
                let clientId = this._getValue("oauthClientId");
                while (oauthSelect.options.length > 1) {
                    oauthSelect.options.remove(1);
                }

                oauthClients.forEach(oauthClient => {
                    if (oauthClient.apiAccessEnabled === false && oauthClient.redirectUris[0].endsWith("/sac/oauth.html")) {
                        oauthSelect.options.add(new Option(oauthClient.name, oauthClient.id, false, oauthClient.clientId == clientId));
                    }
                });

                oauthSelect.addEventListener("change", () => {
                    let value = oauthSelect.value;
                    if (value) {
                        let oauth = {};
                        Promise.all([
                            fetch("/oauthservice/api/v1/tenantinfo?tenant=" + window.TENANT).then(response => response.json()).then(tenantOauthInfo => {
                                oauth.authorization_URL = tenantOauthInfo.baseUrl + tenantOauthInfo.authEndpoint;
                                oauth.token_URL = tenantOauthInfo.baseUrl + tenantOauthInfo.tokenEndpoint;
                            }),
                            fetch("/oauthservice/api/v1/oauthclient/" + value + "?tenant=" + window.TENANT).then(response => response.json()).then(oauthClient => {
                                oauth.client_id = oauthClient.clientId;
                                oauth.client_redirect_URL = oauthClient.redirectUris[0];
                            }),
                            fetch("/oauthservice/api/v1/oauthclient/" + value + "/secret?tenant=" + window.TENANT).then(response => response.text()).then(clientSecret => {
                                oauth.client_secret = clientSecret;
                            })
                        ]).then(() => {
                            this.oauth = JSON.stringify(oauth);
                            this._changeProperty("oauth");
                        });
                    } else {
                        this.oauth = null;
                        this._changeProperty("oauth");
                    }
                });
                oauthSelect.closest("tr").hidden = false;
            });
        }

        _submit(e) {
            e.preventDefault();
            let properties = {};
            for (let name of BiExportAps.observedAttributes) {
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

        get filename() {
            return this._getValue("filename");
        }
        set filename(value) {
            this._setValue("filename", value);
        }

        get exportLanguage() {
            return this._getValue("exportLanguage");
        }
        set exportLanguage(value) {
            this._setValue("exportLanguage", value);
        }

        get screenWidth() {
            return this._getValue("screenWidth");
        }
        set screenWidth(value) {
            this._setValue("screenWidth", value);
        }

        get screenHeight() {
            return this._getValue("screenHeight");
        }
        set screenHeight(value) {
            this._setValue("screenHeight", value);
        }

        get parseCss() {
            return this._getBooleanValue("parseCss");
        }
        set parseCss(value) {
            this._setBooleanValue("parseCss", value);
        }

        get biAnalyticsDocument() {
            return this._getBooleanValue("biAnalyticsDocument");
        }
        set biAnalyticsDocument(value) {
            this._setBooleanValue("biAnalyticsDocument", value);
        }

        get pdfTemplate() {
            return this._getValue("pdfTemplate");
        }
        set pdfTemplate(value) {
            this._setValue("pdfTemplate", value);
        }

        get pptSeparate() {
            return this._getBooleanValue("pptSeparate");
        }
        set pptSeparate(value) {
            this._setBooleanValue("pptSeparate", value);
        }

        get pptTemplate() {
            return this._getValue("pptTemplate");
        }
        set pptTemplate(value) {
            this._setValue("pptTemplate", value);
        }

        get docTemplate() {
            return this._getValue("docTemplate");
        }
        set docTemplate(value) {
            this._setValue("docTemplate", value);
        }

        get xlsTemplate() {
            return this._getValue("xlsTemplate");
        }
        set xlsTemplate(value) {
            this._setValue("xlsTemplate", value);
        }

        get publishMode() {
            return this._getValue("publishMode");
        }
        set publishMode(value) {
            this._setValue("publishMode", value);
        }

        get publishSync() {
            return this._getBooleanValue("publishSync");
        }
        set publishSync(value) {
            this._setBooleanValue("publishSync", value);
        }

        get mailFrom() {
            return this._getValue("mailFrom");
        }
        set mailFrom(value) {
            this._setValue("mailFrom", value);
        }

        get mailTo() {
            return this._getValue("mailTo");
        }
        set mailTo(value) {
            this._setValue("mailTo", value);
        }

        get mailSubject() {
            return this._getValue("mailSubject");
        }
        set mailSubject(value) {
            this._setValue("mailSubject", value);
        }

        get mailBody() {
            return this._getValue("mailBody");
        }
        set mailBody(value) {
            this._setValue("mailBody", value);
        }

        get showIcons() {
            return this._getBooleanValue("showIcons");
        }
        set showIcons(value) {
            this._setBooleanValue("showIcons", value);
        }

        get showTexts() {
            return this._getBooleanValue("showTexts");
        }
        set showTexts(value) {
            this._setBooleanValue("showTexts", value);
        }

        get showComponentSelector() {
            return this._getBooleanValue("showComponentSelector");
        }
        set showComponentSelector(value) {
            this._setBooleanValue("showComponentSelector", value);
        }

        get showViewSelector() {
            return this._getBooleanValue("showViewSelector");
        }
        set showViewSelector(value) {
            this._setBooleanValue("showViewSelector", value);
        }

        get enablePpt() {
            return this._getBooleanValue("enablePpt");
        }
        set enablePpt(value) {
            this._setBooleanValue("enablePpt", value);
        }

        get enableDoc() {
            return this._getBooleanValue("enableDoc");
        }
        set enableDoc(value) {
            this._setBooleanValue("enableDoc", value);
        }

        get enablePdf() {
            return this._getBooleanValue("enablePdf");
        }
        set enablePdf(value) {
            this._setBooleanValue("enablePdf", value);
        }

        get enableXls() {
            return this._getBooleanValue("enableXls");
        }
        set enableXls(value) {
            this._setBooleanValue("enableXls", value);
        }

        get enableCsv() {
            return this._getBooleanValue("enableCsv");
        }
        set enableCsv(value) {
            this._setBooleanValue("enableCsv", value);
        }

        get enablePng() {
            return this._getBooleanValue("enablePng");
        }
        set enablePng(value) {
            this._setBooleanValue("enablePng", value);
        }

        get pdfOrient() {
            return this.pdf_orient;
        }
        set pdfOrient(value) {
            this.pdf_orient = value;
        }

        get pdfHeader() {
            return this.pdf_header;
        }
        set pdfHeader(value) {
            this.pdf_header = value;
        }

        get pdfFooter() {
            return this.pdf_footer;
        }
        set pdfFooter(value) {
            this.pdf_footer = value;
        }

        get tablesSelectedWidgets() {
            return this.tables_SelectedWidgets;
        }
        set tablesSelectedWidgets(value) {
            this.tables_SelectedWidgets = value;
        }

        get pdfSelectedWidgets() {
            return this.pdf_SelectedWidgets;
        }
        set pdfSelectedWidgets(value) {
            this.pdf_SelectedWidgets = value;
        }

        get pptSelectedWidgets() {
            return this.ppt_SelectedWidgets;
        }
        set pptSelectedWidgets(value) {
            this.ppt_SelectedWidgets = value;
        }

        get docSelectedWidgets() {
            return this.doc_SelectedWidgets;
        }
        set docSelectedWidgets(value) {
            this.doc_SelectedWidgets = value;
        }

        get xlsSelectedWidgets() {
            return this.xls_SelectedWidgets;
        }
        set xlsSelectedWidgets(value) {
            this.xls_SelectedWidgets = value;
        }

        get pngSelectedWidgets() {
            return this.png_SelectedWidgets;
        }
        set pngSelectedWidgets(value) {
            this.png_SelectedWidgets = value;
        }
        get oauth() {
            if (this._getValue("oauthClientId")) {
                return JSON.stringify({
                    client_id: this._getValue("oauthClientId"),
                    client_secret: this._getValue("oauthClientSecret"),
                    client_redirect_URL: this._getValue("oauthClientRedirectURL"),
                    authorization_URL: this._getValue("oauthAuthorizationURL"),
                    token_URL: this._getValue("oauthTokenURL")
                });
            }
            return null;
        }
        set oauth(value) {
            if (value) {
                let oauth = JSON.parse(value);
                this._setValue("oauthClientId", oauth.client_id);
                this._setValue("oauthClientSecret", oauth.client_secret);
                this._setValue("oauthClientRedirectURL", oauth.client_redirect_URL);
                this._setValue("oauthAuthorizationURL", oauth.authorization_URL);
                this._setValue("oauthTokenURL", oauth.token_URL);
            } else {
                this._setValue("oauthClientId", "");
                this._setValue("oauthClientSecret", "");
                this._setValue("oauthClientRedirectURL", "");
                this._setValue("oauthAuthorizationURL", "");
                this._setValue("oauthTokenURL", "");
            }
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
                "filename",

                "exportLanguage",
                "screenWidth",
                "screenHeight",
                "parseCss",
                "biAnalyticsDocument",
                "tablesSelectedWidgets",

                "pdfTemplate",
                "pdfSelectedWidgets",

                "pdfHeader",
                "pdfFooter",
                "pdfOrient",

                "pptSeparate",
                "pptTemplate",
                "pptSelectedWidgets",

                "docTemplate",
                "docSelectedWidgets",

                "xlsTemplate",
                "xlsSelectedWidgets",

                "pngSelectedWidgets",

                "publishMode",
                "publishSync",
                "mailFrom",
                "mailTo",
                "mailSubject",
                "mailBody",

                "showIcons",
                "showTexts",
                "showViewSelector",
                "showComponentSelector",
                "enablePpt",
                "enableDoc",
                "enablePdf",
                "enableXls",
                "enableCsv",
                "enablePng",

                "oauth"
            ];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue != newValue) {
                this[name] = newValue;
            }
        }
    }
    customElements.define("com-biexcellence-openbi-sap-sac-export-aps", BiExportAps);
})();
