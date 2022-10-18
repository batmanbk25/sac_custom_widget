(function () {
    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
      <style>
      </style>
      <div id="biannotation_div" name="biannotation_div">
      <table class="sapEpmUiControlCrosstab">
        <thead></thead>
        <tbody></tbody>
      </table>
      </div>
    `;

    class biAnnotations extends HTMLElement {

        constructor() {
            super();

            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            this.widgetId = "";
            this.inlineStyle = "";
            this.legendStyle = "";
            this.data = "";
            this._comments = [];
            this._values = [];
            this._highlights = [];
            this.tableType = 0;
            this.hideCommentIcons = true;
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            if ("designMode" in changedProperties) {
                this._designMode = changedProperties["designMode"];
            }
        }

        // SETTINGS

        getWidgetID() {
            return this.widgetId;
        }
        setWidgetID(value) {
            var lkey = "";

            if (this._metadata == null) {
                this._metadata = getMetadata();
            }

            for (var key in this._metadata.components) {
                if (this._metadata.components[key].name == value) {
                    this._setValue("widgetId", key);
                    lkey = key;
                    break;
                }
            }
            if (lkey == "") {
                this._setValue("widgetId", value);
            }
        }

        isCommentIconsHidden() {
            return this.hideCommentIcons;
        }
        hideCommentIcons(value) {
            this._setValue("hideCommentIcons", value);
        }

        getInlineStlye() {
            return this.inlineStyle;
        }
        setInlineStlye(value) {
            this._setValue("inlineStyle", value);
        }

        getLegendStlye() {
            return this.legendStyle;
        }
        setLegendStlye(value) {
            this._setValue("legendStyle", value);
        }
        // METHODS

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

        getTableSelections() {
            let ldata = this._metadata.components[this.widgetId].data;
            let larray = [];

            for (var y = 0; y < ldata.length; y++) {
                for (var x = 0; x < ldata[y].length; x++) {
                    let lcell = ldata[y][x].cellMemberContext;
                    let selection = {};

                    if (lcell != null) {
                        for (var key in lcell) {
                            if (key.indexOf("Account_") >= 0) {
                                selection["@MeasureDimension"] = lcell[key].id;
                            } else {
                                selection[key] = lcell[key].id;
                            }
                        }

                        larray.push(selection);
                    }
                }
            }

            return larray;
        }

        getCommentSelections() {
            let ldata = this._metadata.components[this.widgetId].data;
            let larray = [];

            for (var y = 0; y < ldata.length; y++) {
                for (var x = 0; x < ldata[y].length; x++) {

                    // get Table Widget CELL
                    var lrow = {};
                    lrow.rowNumber = y;
                    lrow.columnNumber = x;
                    let ltablecell = this._getTableCell(lrow);

                    if (ltablecell != null) {
                        if (ltablecell.firstElementChild != null) {
                            if (ltablecell.firstElementChild.getAttribute("class").indexOf("sapDataPointComment") > 0) {
                                let lcell = ldata[y][x].cellMemberContext;
                                let selection = {};

                                if (lcell != null) {
                                    for (var key in lcell) {
                                        if (key.indexOf("Account_") >= 0) {
                                            selection["@MeasureDimension"] = lcell[key].id;
                                        } else {
                                            selection[key] = lcell[key].id;
                                        }
                                    }

                                    larray.push(selection);
                                }
                            }
                        }
                    }
                }
            }

            return larray;
        }

        getSelectedRow(selection) {
            return this._getSelectedCell(selection).row;
        }

        getSelectedCol(selection) {
            return this._getSelectedCell(selection).column;
        }

        _getSelectedCell(selection) {
            var lrow = 0;
            var lcol = 0;

            if (selection == null) {
                return 0;
            }

            if (this._metadata == null) {
                this._metadata = getMetadata();
            }

            let ldata = this._metadata.components[this.widgetId].data;

            for (var y = 0; y < ldata.length; y++) {
                for (var x = 0; x < ldata[y].length; x++) {
                    let lcell = ldata[y][x].cellMemberContext;

                    if (lcell != null) {
                        var lmatch = true;
                        for (var key in lcell) {
                            if (selection[key] != null) {
                                // first try - full match
                                if (selection[key] != lcell[key].id) {
                                    lmatch = false;
                                    break;
                                }
                            } else {
                                // second try - @MeasureDimension
                                if (selection["@MeasureDimension"] != lcell[key].id) {
                                    lmatch = false;
                                    break;
                                }
                            }
                        }

                        if (lmatch) {
                            lrow = y;
                            lcol = x;
                            break;
                        }
                    }
                }

                if (lrow > 0 && lcol > 0) { break; }
            }

            return { "row": lrow, "column": lcol };

        }

        commentCell(comment, commentindex, row, column, overwrite) {
            // determine commentindex if needed
            if (commentindex == 0) {
                commentindex = this._comments.length + 1;
            }

            // update data
            var lrow = {};
            lrow.widget = "";
            lrow.comment = comment;
            lrow.index = commentindex;
            lrow.rowNumber = row;
            lrow.columnNumber = column;
            this._comments.push(lrow);

            // get Table Widget CELL
            let ltablecell = this._getTableCell(lrow);

            // update Table Widget CELL
            this._updateTableCell(ltablecell, lrow, overwrite);

            // update Comment BODY
            this._updateCommentBody(lrow);

        }

        commentWidget(comment, commentindex, widget) {
            var lwidget = widget;
            var ltype = "";

            if (this._metadata == null) {
                this._metadata = getMetadata();
            }

            for (var key in this._metadata.components) {
                if (this._metadata.components[key].name == widget) {
                    lwidget = key;
                    ltype = this._metadata.components[key].type;
                }
            }

            // determine commentindex if needed
            if (commentindex == 0) {
                commentindex = this._comments.length + 1;
            }

            // update data
            var lrow = {};
            lrow.widget = lwidget;
            lrow.comment = comment;
            lrow.index = commentindex;
            this._comments.push(lrow);

            // update Table Widget
            this._updateWidget(ltype, lrow);

            // update Comment BODY
            this._updateCommentBody(lrow);

        }

        overwriteCell(value, row, column) {
            // update data
            var lrow = {};
            lrow.newValue = value;
            lrow.originalValue = "";
            lrow.rowNumber = row;
            lrow.columnNumber = column;
            this._values.push(lrow);

            // get Table Widget CELL
            let ltablecell = this._getTableCell(lrow);

            // update Table Widget CELL
            this._updateTableCell(ltablecell, lrow);

        }

        highlightCell(style, row, column) {
            // update data
            var lrow = {};
            lrow.style = style;
            lrow.originalStyle = "";
            lrow.rowNumber = row;
            lrow.columnNumber = column;
            this._highlights.push(lrow);

            // get Table Widget CELL
            let ltablecell = this._getTableCell(lrow);

            // update Table Widget CELL
            this._updateTableCell(ltablecell, lrow);

        }

        overwriteUnbookedCells() {
            let ltable;
            if (this.widgetId.indexOf("__widget" == -1)) {
                ltable = document.querySelector('[data-sap-widget-id="' + this.widgetId + '"]>div');
            } else {
                ltable = document.querySelector("#" + this.widgetId + ">div");
            }

            let lunbooked = ltable.querySelectorAll('.unbooked');
            for (var i = 0; i < lunbooked.length; i++) {

                let lsvg = lunbooked[i].querySelector("svg");
                if (lsvg != null) {
                    lunbooked[i].removeChild(lsvg);
                    lunbooked[i].appendChild(document.createTextNode("n.a."));
                }
            }

        }

        _getTableCell(irow) {
            let ltable;
            if (this.widgetId.indexOf("__widget" == -1)) {
                ltable = document.querySelector('[data-sap-widget-id="' + this.widgetId + '"]>div');
            } else {
                ltable = document.querySelector("#" + this.widgetId + ">div");
            }

            // get tablecell 
            // data - col is based on 1
            let tablecell = ltable.querySelector('[data-col="' + (irow.columnNumber + 1) + '"][data-row="' + (irow.rowNumber + 1) + '"]');
            this.tableType = 1;
            if (tablecell == null) {
                // tablecol is based on 0
                tablecell = ltable.querySelector('[data-tablecol="' + irow.columnNumber + '"][data-tablerow="' + irow.rowNumber + '"]');
                this.tableType = 0;
            }

            return tablecell;
        }

        _linkify(inputText) {
        var replacedText, replacePattern1, replacePattern2, replacePattern3;

        //URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

        //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

        //Change email addresses to mailto:: links.
        replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

        return replacedText;
        }

        _updateTableCell(itablecell, irow, overwrite) {
            if (itablecell != null) {

                // set for Excel so the index is not interpreted as a number!
                itablecell.setAttribute("data-disable-number-formatting", "X");

                let ltablecell;
                if (itablecell.firstChild.getAttribute("class").indexOf("sapDataPointComment") >= 0) {
                    // skip datapoint comment
                    ltablecell = itablecell.childNodes[1];

                    // delete icon on hideCommentIcons
                    if (this.hideCommentIcons) {
                        itablecell.firstChild.setAttribute("class", itablecell.firstChild.getAttribute("class").replace("sapUiIcon", ""));
                    }

                } else {
                    // tableType 0 renders a DIV instead of a SPAN with the number
                    ltablecell = itablecell.firstChild;
                }

                for (var i = 0; i < ltablecell.childNodes.length; i++) {
                    if (ltablecell.childNodes[i].nodeType == 3) {
                        // overwrite values
                        if (irow.newValue != null) {
                            if (irow.newValue != "") {
                                if (irow.originalValue == "") {
                                    irow.originalValue = ltablecell.childNodes[i].nodeValue;
                                }
                                ltablecell.childNodes[i].nodeValue = irow.newValue;
                                ltablecell.setAttribute("title", irow.newValue);
                            } else {
                                ltablecell.childNodes[i].nodeValue = irow.originalValue;
                                ltablecell.setAttribute("title", irow.originalValue);
                            }
                        }

                        // comments
                        if (irow.index != null) {
                            var larray = [];
                            var ltexts = [];
                            for (var j = 0; j < this._comments.length; j++) {
                                if (this._comments[j].rowNumber == irow.rowNumber && this._comments[j].columnNumber == irow.columnNumber && this._comments[j].comment != "") {
                                    larray.push(this._comments[j].index);
                                    ltexts.push(this._comments[j].comment);
                                }
                            }

                            var ltext = "";
                            if ((larray.length == 0 && ltablecell.querySelector("sup") == null) || overwrite) {
                                ltext = larray.join(", ");
                                ltablecell.childNodes[i].nodeValue = ltext;
                                ltablecell.setAttribute("title", ltext);
                            } else {
                                let lsup = ltablecell.querySelector("sup");
                                if (lsup == null) {
                                    lsup = document.createElement("sup");
                                    ltablecell.appendChild(lsup);
                                }
                                lsup.textContent = larray.join(", ");
                                ltablecell.setAttribute("title", ltablecell.getAttribute("title") + " " + ltexts.join(", ").replace(/(<([^>]+)>)/gi, ""));

                            }

                        }

                    }
                }

                // highlights
                if (irow.style != null) {
                    if (irow.style != "") {
                        irow.originalStyle = ltablecell.style.backgroundColor;
                        ltablecell.style.backgroundColor = irow.style;
                    } else {
                        ltablecell.style.backgroundColor = irow.originalStyle;
                    }
                }

                if (overwrite) {
                    if (ltablecell.nextSibling != null) {
                        ltablecell.style.color = ltablecell.nextSibling.style.color
                    } else {
                        ltablecell.style.color = "rgb(51, 51, 51)";
                    }
                }
            }
        }

        _updateWidget(itype, irow) {
            let lwidget = document.querySelector('[data-sap-widget-id="' + irow.widget + '"]>div');

            if (lwidget != null) {
                // comments
                if (irow.index != null) {
                    var larray = [];
                    for (var j = 0; j < this._comments.length; j++) {
                        if (this._comments[j].widget == irow.widget) {
                            larray.push(this._comments[j].index);
                        }
                    }

                    switch (itype) {
                        case "textWidget":
                            let lspan = lwidget.querySelector("span")
                            let lsup = lspan.querySelector("sup");

                            if (lsup == null) {
                                lsup = document.createElement("sup");
                                lspan.appendChild(lsup);
                            }

                            lsup.textContent = larray.join(", ");
                            break;
                    }

                }

            }
        }

        _updateCommentBody(irow) {
            let table = this._shadowRoot.querySelector("#biannotation_div >table");
            let tbody = table.children[1];

            let tr = document.createElement("tr");

            // index
            let td1 = document.createElement("td");
            td1.setAttribute("class", "default defaultTableCell generalCell hideBorder generalCell dimMember rowDimMemberCell generalCell sapDimMemberCellHeading")
            td1.setAttribute("style", "font-size: 11px; line-height: 12px; color: rgb(0, 0, 0); fill: rgb(0, 0, 0); font-family: arial; background-color: transparent; vertical-align: middle;font-weight:bold;max-width:30px;");
            td1.textContent = irow.index;
            td1.setAttribute("title", irow.index);
            tr.appendChild(td1);

            // comment
            let td2 = document.createElement("td");
            td2.setAttribute("class", "default defaultTableCell generalCell hideBorder generalCell dimMember rowDimMemberCell generalCell sapDimMemberCellHeading")
            td2.setAttribute("style", "font-size: 11px; line-height: 12px; color: rgb(0, 0, 0); fill: rgb(0, 0, 0); font-family: arial; background-color: transparent; vertical-align: middle;max-width:100%;");
            td2.setAttribute("title", irow.comment.replace(/(<([^>]+)>)/gi, ""));

            tr.appendChild(td2);
            tbody.appendChild(tr);

            if (irow.comment.indexOf("<a href") < 0) {
                // linkify: currently only supported if no ready HTML markup is provided
                $(td2).html("<span>" + this._linkify(irow.comment) + "</span>");
            } else {
                // support HTML
                $(td2).html("<span>" + irow.comment + "</span>");

            }

        }

        clearCellValues() {
            this._values = [];
        }

        clearCellHighlights() {
            this._highlights = [];
        }

        clearWidgetComment(widget) {
            var lcomment;
            let lpos = 0;
            let table = this._shadowRoot.querySelector("#biannotation_div >table");
            let tbody = table.children[1];

            // update data
            for (var i = 0; i < this._comments.length; i++) {
                lcomment = this._comments[i];

                if (lcomment.widget == widget) {
                    lcomment.comment = "";

                    if (tbody.children[lcomment.index] != null) {
                        tbody.removeChild(tbody.children[lcomment.index] - lpos);
                        lpos = lpos - 1;
                    }
                }
            }

            if (lcomment != null) {
                // update Table Widget
                this._updateWidget(ltype, lrow);
            }
        }

        clearCellValue(row, column) {
            var lcomment;

            // update data
            for (var i = 0; i < this._values.length; i++) {
                if (this._values[i].rowNumber == row && this._values[i].columnNumber == column) {
                    lcomment = this._values[i];
                    lcomment.newValue = "";
                }
            }

            if (lcomment != null) {
                // get Table Widget CELL
                let ltablecell = this._getTableCell(lcomment);

                // update Table Widget CELL
                this._updateTableCell(ltablecell, lcomment);
            }

        }

        clearCellHighlight(row, column) {
            var lcomment;

            // update data
            for (var i = 0; i < this._highlights.length; i++) {
                if (this._highlights[i].rowNumber == row && this._highlights[i].columnNumber == column) {
                    lcomment = this._highlights[i];
                    lcomment.style = "";
                }
            }

            if (lcomment != null) {
                // get Table Widget CELL
                let ltablecell = this._getTableCell(lcomment);

                // update Table Widget CELL
                this._updateTableCell(ltablecell, lcomment);
            }
        }

        clearCellComment(row, column) {
            var lcomment;
            let lpos = 0;
            let table = this._shadowRoot.querySelector("#biannotation_div >table");
            let tbody = table.children[1];

            // update data
            for (var i = 0; i < this._comments.length; i++) {

                if (this._comments[i].rowNumber == row && this._comments[i].columnNumber == column) {
                    lcomment = this._comments[i];
                    lcomment.comment = "";

                    if (tbody.children[lcomment.index - 1 - lpos] != null) {
                        tbody.removeChild(tbody.children[lcomment.index - 1 - lpos]);
                        lpos = lpos + 1;
                    }
                }
            }

            if (lcomment != null) {
                // get Table Widget CELL
                let ltablecell = this._getTableCell(lcomment);

                // update Table Widget CELL
                this._updateTableCell(ltablecell, lcomment);
            }
        }

        clearCellComments() {
            this._clearComments();
        }

        _clearComments() {
            let table = this._shadowRoot.querySelector("#biannotation_div >table");
            let thead = table.children[0];
            let tbody = table.children[1];

            while (thead.firstChild) {
                thead.removeChild(thead.lastChild)
            }
            while (tbody.firstChild) {
                tbody.removeChild(tbody.lastChild)
            }
        }


    }
    customElements.define("com-biexcellence-openbi-sap-sac-biannotations", biAnnotations);

    // UTILS

    const contentDispositionFilenameRegExp = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i;

    function getMetadata() {
        let findAggregatedObjects;

        let shell = commonApp.getShell();
        if (shell) { // old SAC
            findAggregatedObjects = fn => shell.findElements(true, fn);
        }
        if (!findAggregatedObjects) { // new SAC
            findAggregatedObjects = fn => sap.fpa.ui.story.Utils.getShellContainer().getCurrentPage().getComponentInstance().findAggregatedObjects(true, fn);
        }

        let documentContext = findAggregatedObjects(e => e.getMetadata().hasProperty("resourceType") && e.getProperty("resourceType") == "STORY")[0].getDocumentContext();
        let storyModel = documentContext.get("sap.fpa.story.getstorymodel");
        let entityService = documentContext.get("sap.fpa.bi.entityService");
        let widgetControls = documentContext.get("sap.fpa.story.document.widgetControls");

        let components = {};
        storyModel.getAllWidgets().forEach((widget) => {
            if (widget) { // might be undefined during edit
                let component = {
                    type: widget.class
                }

                let widgetControl = widgetControls.filter((control) => control.getWidgetId() == widget.id)[0];
                if (widgetControl) { // control specific stuff
                    if (typeof widgetControl.getTableController == "function") { // table
                        let tableController = widgetControl.getTableController();
                        if (tableController != null) {
                            let regions = tableController.getDataRegions();

                            try {
                                let cells = regions[0].getCells();
                                component.data = cells.map((row) => row.map((cell) => cell.getJSON()));
                            }
                            catch (e) {
                            }
                        }
                    }
                }

                components[widget.id] = component;
            }
        });
        let datasources = {};
        entityService.getDatasets().forEach((datasetId) => {
            let dataset = entityService.getDatasetById(datasetId);
            datasources[datasetId] = {
                name: dataset.name,
                description: dataset.description,
                model: dataset.model
            };

            storyModel.getWidgetsByDatasetId(datasetId).forEach((widget) => {
                components[widget.id].datasource = datasetId;
            });
        });

        let result = {
            components: components,
            datasources: datasources
        }

        // only for applications (not stories)
        let app;

        let outlineContainer = findAggregatedObjects(e => e.hasStyleClass && e.hasStyleClass("sapAppBuildingOutline"))[0]; // sId: "__container0"
        if (outlineContainer) { // outlineContainer has more recent data than applicationEntity during edit
            if (!app) {
                try {
                    app = outlineContainer.getReactProps().store.getState().globalState.instances.app["[{\"app\":\"MAIN_APPLICATION\"}]"]._usis; /* SAC 2021.5.1 */
                } catch (e) { /* ignore */ }
            }
            if (!app) {
                try {
                    app = outlineContainer.getReactProps().store.getState().globalState.instances.app["[{\"app\":\"MAIN_APPLICATION\"}]"]; /* old SAC */
                } catch (e) { /* ignore */ }
            }
        }

        if (!app) {
            let applicationEntity = storyModel.getApplicationEntity();
            if (applicationEntity) {
                app = applicationEntity.app;
            }
        }

        if (app) {
            let names = app.names;

            for (let key in names) {
                let name = names[key];

                let obj = JSON.parse(key).pop();
                let type = Object.keys(obj)[0];
                let id = obj[type];

                let component = components[id];
                if (component) { // might be undefined during edit
                    component.type = type;
                    component.name = name;
                }
            }

            result.vars = app.globalVars;
        }

        return result;
    }

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

})();