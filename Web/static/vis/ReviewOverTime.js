
class ReviewOverTimeVis {
    constructor(targetDiv) {
        this.otherCharts = []
        this.chart = Highcharts.chart(targetDiv, {
            chart: {
                zoomType: "x",
            },

            title: {
                text: "Amount of reviews over time"
            },

            xAxis: {
                title: {
                    text: "Date"
                },
                type: 'datetime'
            },

            yAxis: {
                title: {
                    text: "Amount of reviews"
                }
            },

            series: [
                {
                    name: 'Amount of reviews',
                    type: "line",
                    data: [[20, 20], [20, 20]]
                }
            ]
        })
    }

    update(arg) {
        if (arg == undefined) {
            console.error("Invalid argument provided")
            return
        }
        arg["chart"] = "reviewovertime"
        var chart = this.chart

        // Show loading
        chart.showLoading()

        // Request data
        $.ajax({
            type: "GET",
            url: "/data/?" + paramString(arg),
            success: function (res) {
                var data = JSON.parse(res)
                data.forEach(entry => {
                    entry[0] = Date.parse(entry[0])
                });

                chart.series[0].setData(data, true, true, true)
                chart.hideLoading()
            },
        })
    }

    setOtherCharts(charts) {
        charts.forEach(chart => {
            if (chart != this) {
                this.otherCharts.push(chart)
            }
        });
    }
}