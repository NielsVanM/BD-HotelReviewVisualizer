class ReviewByNationalityVis {
    constructor(targetDiv) {
        this.otherCharts = []
        this.chart = Highcharts.chart('piechart', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Amount or reviews per nationality'
            },
            plotOptions: {
                pie: {
                    cursor: 'pointer',
                    innerSize: 150,
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y}',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    },
                    point: {
                        events: {
                            click: this.onClick
                        }
                    }
                },
                series: {
                    turboThreshold: 10000,
                }
            },
            series: [{
                name: 'Dummy',
                colorByPoint: true,
                data: []
            }]
        });
    }

    update(arg) {
        if (arg == undefined) {
            console.error("Invalid argument provided")
            return
        }
        arg["chart"] = "reviewpernationality"
    
        var chart = this.chart

        chart.showLoading()
    
        $.ajax({
            type: "GET",
            url: "/data/?" + paramString(arg),
            success: function(res) {
                var data = JSON.parse(res)
    
                chart.series[0].setData(data, true, true, true)
                chart.hideLoading()
            }
        })
    }

    setOtherCharts(charts) {
        charts.forEach(chart => {
            if (chart != this) {
                this.otherCharts.push(chart)
            }
        });
    }

    onClick(e) {
        UpdateCharts(this.series.chart, {"countries": this.name})
    }
}