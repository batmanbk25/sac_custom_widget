var getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)
    })
}

(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <div id="root" style="width: 100%; height: 100%;">
        </div>
    `;

    customElements.define('com-sap-sample-test', class test extends HTMLElement {


        constructor() {
            super();
            let shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(tmpl.content.cloneNode(true));

            this._root = this.shadowRoot.getElementById('root');
            this._props = {};

            // this.render();
        }


        //Fired when the widget is added to the html DOM of the page
        connectedCallback() {
            this._firstConnection = true;
            this.redraw();
        }

        //Fired when the widget is removed from the html DOM of the page (e.g. by hide)
        disconnectedCallback() {

        }

        //When the custom widget is updated, the Custom Widget SDK framework executes this function first
        onCustomWidgetBeforeUpdate(oChangedProperties) {

        }

        //When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
        onCustomWidgetAfterUpdate(oChangedProperties) {
            if (this._firstConnection) {
                this.redraw();
            }
        }

        //When the custom widget is removed from the canvas or the analytic application is closed
        onCustomWidgetDestroy() {
        }

        //When the custom widget is resized on the canvas, the Custom Widget SDK framework executes the following JavaScript function call on the custom widget
        // Commented out by default.  If it is enabled, SAP Analytics Cloud will track DOM size changes and call this callback as needed
        //  If you don't need to react to resizes, you can save CPU by leaving it uncommented.

        onCustomWidgetResize(width, height) {
            this.render();
        }

        open() {
            const dataBinding = this.dataBindings.getDataBinding('myDataBinding');
            console.log(dataBinding.getDimensions());
            console.log(dataBinding.getMembers());
            dataBinding.openSelectModelDialog();
        }


        getData() {
            console.log(this.myDataBinding);
        }
		
		var sHost = "https://s420demo.citek.vn:44335"; 
		var sUser = "CT.ABAPHN";
		var sPassword = "1234567aA@";  
		var sGetTokenModulePath = sHost + "/zsacex/getexcelcontent?template=ZXLSX_SAC_EXPORT_001";
		var sUrl, sXsrfToken;
        get_excel() {
			window.open(sGetTokenModulePath, "_blank");
			return;
        }

        chart1() {
            this.render();
        }

        chart2() {
            this.render2();
        }

        async render2() {
            getScriptPromisify('https://cdnjs.cloudflare.com/ajax/libs/echarts/5.3.3/echarts.min.js')
            var jsons = [];
            this.myDataBinding.data.forEach(row => {
                var obj = { value: row.measures_0.raw, name: row.dimensions_0.label };
                jsons.push(obj);
            });
            const chart = echarts.init(this._root);
            const option = {
                legend: {
                    top: 'bottom'
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                series: [
                    {
                        name: 'Nightingale Chart',
                        type: 'pie',
                        radius: [50, 250],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 8
                        },
                        data: jsons
                        // data: [
                        //   { value: 40, name: 'rose 1' },
                        //   { value: 38, name: 'rose 2' },
                        //   { value: 32, name: 'rose 3' },
                        //   { value: 30, name: 'rose 4' },
                        //   { value: 28, name: 'rose 5' },
                        //   { value: 26, name: 'rose 6' },
                        //   { value: 22, name: 'rose 7' },
                        //   { value: 18, name: 'rose 8' }
                        // ]
                    }
                ]
            };
            chart.setOption(option)
        }

        async render() {
            await getScriptPromisify('https://cdnjs.cloudflare.com/ajax/libs/echarts/5.3.3/echarts.min.js')
            var jsons = [];
            this.myDataBinding.data.forEach(row => {
                var obj = { value: row.measures_0.raw, name: row.dimensions_0.label };
                jsons.push(obj);
            });
            const chart = echarts.init(this._root);
            const option = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: jsons
                        // data: [
                        //     { value: 1048, name: 'Search Engine' },
                        //     { value: 735, name: 'Direct' },
                        //     { value: 580, name: 'Email' },
                        //     { value: 484, name: 'Union Ads' },
                        //     { value: 300, name: 'Video Ads' }
                        // ]
                    }
                ]
            };
            chart.setOption(option)
        }

        redraw() {
        }


    });

})();