var getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)
    })
}

(function () {
    const prepared = document.createElement('template')
    prepared.innerHTML = `
        <style>
        </style>
        <div id="root" style="width: 100%; height: 100%;">
        </div>
      `
    class SamplePrepared extends HTMLElement {
        constructor() {
            super()

            this._shadowRoot = this.attachShadow({ mode: 'open' })
            this._shadowRoot.appendChild(prepared.content.cloneNode(true))

            this._root = this._shadowRoot.getElementById('root')

            this._props = {}

            this.render()
        }

        onCustomWidgetResize(width, height) {
            this.render()
        }
 
        get_excel() {
            var sHost = "https://s420demo.citek.vn:44335";
            var sUser = "CT.ABAPHN";
            var sPassword = "1234567aA@"; 
            var sGetTokenModulePath = sHost + "/zsacex/getexcelcontent?template=ZXLSX_SAC_EXPORT_001"; 
		
            var xhr = new XMLHttpRequest();

            // Making our connection  
            var url = sGetTokenModulePath; 

            xhr.open("GET", url, false, sUser, sPassword);
            var headers = {
                'Access-Control-Allow-Origin': '*', 
                'Authorization': 'Basic ' + btoa(sUser + ":" + sPassword),
                'x-csrf-token': 'fetch'
            }
           xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
             
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(sUser + ":" + sPassword)); 
            xhr.setRequestHeader('mode', "no-cors");  
            console.log(xhr.headers);
            // function execute after request is successful 
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText);
                }
            }
            // Sending our request 
            xhr.send(null);
            console.log(xhr.getAllResponseHeaders());
            return;
			window.open("https://s420demo.citek.vn:44335/zsacex/getexcelcontent?template=ZXLSX_SAC_EXPORT_001", "_blank");
			return;
        }


        async render() {
            await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js')

            this._placeholder = this._root.querySelector('#placeholder')
            if (this._placeholder) {
                this._root.removeChild(this._placeholder)
                this._placeholder = null
            }
            if (this._myChart) {
                echarts.dispose(this._myChart)
            }
            var myChart = this._myChart = echarts.init(this._root, 'dark')

            const MEASURE_DIMENSION = '@MeasureDimension'
            const countries = []
            const timeline = []
            const series = []
            resultSet.forEach(dp => {
                const { rawValue, description } = dp[MEASURE_DIMENSION]
                const country = dp.Country.description
                const year = Number(dp.timeline.description)

                if (countries.indexOf(country) === -1) {
                    countries.push(country)
                }
                if (timeline.indexOf(year) === -1) {
                    timeline.push(year)
                }
                const iT = timeline.indexOf(year)
                series[iT] = series[iT] || []
                const iC = countries.indexOf(country)
                series[iT][iC] = series[iT][iC] || []

                let iV
                if (description === 'Income') { iV = 0 }
                if (description === 'LifeExpect') { iV = 1 }
                if (description === 'Population') { iV = 2 }
                series[iT][iC][iV] = rawValue
                series[iT][iC][3] = country
                series[iT][iC][4] = year
            })

            const data = {
                countries,
                series,
                timeline
            }
            // console.log(data)
            // $.get('https://cdn.jsdelivr.net/gh/apache/incubator-echarts-website@asf-site/examples' + '/data/asset/data/life-expectancy.json', function (data) {
            //   console.log(data)
            // })

            var itemStyle = {
                opacity: 0.8,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }

            var sizeFunction = function (x) {
                var y = Math.sqrt(x / 5e8) + 0.1
                return y * 80
            }
            // Schema:
            var schema = [
                { name: 'Income', index: 0, text: 'Income', unit: 'USD' },
                { name: 'LifeExpectancy', index: 1, text: 'LifeExpectancy', unit: 'Year' },
                { name: 'Population', index: 2, text: 'Population', unit: '' },
                { name: 'Country', index: 3, text: 'Country', unit: '' }
            ]

            const option = {
                baseOption: {
                    timeline: {
                        axisType: 'category',
                        orient: 'vertical',
                        autoPlay: true,
                        inverse: true,
                        playInterval: 1000,
                        left: null,
                        right: 0,
                        top: 20,
                        bottom: 20,
                        width: 55,
                        height: null,
                        label: {
                            color: '#999'
                        },
                        symbol: 'none',
                        lineStyle: {
                            color: '#555'
                        },
                        checkpointStyle: {
                            color: '#bbb',
                            borderColor: '#777',
                            borderWidth: 2
                        },
                        controlStyle: {
                            showNextBtn: false,
                            showPrevBtn: false,
                            color: '#666',
                            borderColor: '#666'
                        },
                        emphasis: {
                            label: {
                                color: '#fff'
                            },
                            controlStyle: {
                                color: '#aaa',
                                borderColor: '#aaa'
                            }
                        },
                        data: []
                    },
                    backgroundColor: '#100c2a',
                    title: [{
                        text: data.timeline[0],
                        textAlign: 'center',
                        left: '63%',
                        top: '55%',
                        textStyle: {
                            fontSize: 100,
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }, {
                        text: 'Life expectancy vs. GDP',
                        left: 'center',
                        top: 10,
                        textStyle: {
                            color: '#aaa',
                            fontWeight: 'normal',
                            fontSize: 20
                        }
                    }],
                    tooltip: {
                        padding: 5,
                        backgroundColor: '#222',
                        borderColor: '#777',
                        borderWidth: 1,
                        formatter: function (obj) {
                            var value = obj.value
                            return schema[3].text + '：' + value[3] + '<br>' +
                                schema[1].text + '：' + value[1] + schema[1].unit + '<br>' +
                                schema[0].text + '：' + value[0] + schema[0].unit + '<br>' +
                                schema[2].text + '：' + value[2] + '<br>'
                        }
                    },
                    grid: {
                        top: 100,
                        containLabel: true,
                        left: 30,
                        right: '110'
                    },
                    xAxis: {
                        type: 'log',
                        name: 'Income',
                        max: 100000,
                        min: 300,
                        nameGap: 25,
                        nameLocation: 'middle',
                        nameTextStyle: {
                            fontSize: 18
                        },
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        },
                        axisLabel: {
                            formatter: '{value} $'
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: 'LifeExpectancy',
                        max: 100,
                        nameTextStyle: {
                            color: '#ccc',
                            fontSize: 18
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            formatter: '{value} Years'
                        }
                    },
                    visualMap: [
                        {
                            show: false,
                            dimension: 3,
                            categories: data.countries,
                            calculable: true,
                            precision: 0.1,
                            textGap: 30,
                            textStyle: {
                                color: '#ccc'
                            },
                            inRange: {
                                color: (function () {
                                    var colors = ['#bcd3bb', '#e88f70', '#edc1a5', '#9dc5c8', '#e1e8c8', '#7b7c68', '#e5b5b5', '#f0b489', '#928ea8', '#bda29a']
                                    return colors.concat(colors)
                                })()
                            }
                        }
                    ],
                    series: [
                        {
                            type: 'scatter',
                            itemStyle: itemStyle,
                            data: data.series[0],
                            symbolSize: function (val) {
                                return sizeFunction(val[2])
                            }
                        }
                    ],
                    animationDurationUpdate: 1000,
                    animationEasingUpdate: 'quinticInOut'
                },
                options: []
            }

            for (var n = 0; n < data.timeline.length; n++) {
                option.baseOption.timeline.data.push(data.timeline[n])
                option.options.push({
                    title: {
                        show: true,
                        text: data.timeline[n] + ''
                    },
                    series: {
                        name: data.timeline[n],
                        type: 'scatter',
                        itemStyle: itemStyle,
                        data: data.series[n],
                        symbolSize: function (val) {
                            return sizeFunction(val[2])
                        }
                    }
                })
            }

            myChart.setOption(option)
        }
    }

    customElements.define('com-sap-sample-echarts-prepared', SamplePrepared)
})()
