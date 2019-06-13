
class HotelMapVis {
    constructor(targetDiv) {
        this.otherCharts = []
        this.chart = Highcharts.mapChart('chart', {
                chart: {
                    map: 'custom/europe',
                },
                title: {
                    text: 'Hotels'
                },
                mapNavigation: {
                    enabled: true
                },
                series: [{
                    name: 'Basemap',
                    borderColor: '#BBBBBB',
                    nullColor: 'rgba(200, 200, 200, 0.3)',
                    showInLegend: false
                }, {
                    type: 'mappoint',
                    name: 'Hotels',
                    colorByPoint: true,
                    data: [{
                        "id": "Dummy",
                        "lon": 0,
                        "lat": 0
                    }]
                }],
                drilldown: {
                    series: []
                },
            });
    }

    update(arg) {
        if (arg == undefined) {
            console.error("Invalid argument provided")
            return
        }
        arg["chart"] = "hotelmap"

        var chart = this.chart

        chart.showLoading()
        $.ajax({
            type: "GET",
            url: "/data/?" + paramString(arg),
            success: function (res) {
                var data = JSON.parse(res)
                var realdata = []

                data.forEach(hotel => {
                    // Parse the information
                    hotel = hotel["_id"]
                    hotel["lat"] = parseFloat(hotel["lat"])
                    hotel["lon"] = parseFloat(hotel["lon"])

                    if (isFinite(hotel["lat"]) && isFinite(hotel["lon"])) {
                        realdata.push(
                            hotel
                        )
                    }

                });

                // Group by location
                var groups = GroupHotels(realdata)

                // Create drilldowns based on groups
                var series = []
                var drillseries = [{
                    name: 'Basemap',
                    borderColor: '#BBBBBB',
                    nullColor: 'rgba(200, 200, 200, 0.3)',
                    showInLegend: false
                }]
                for (var i = 0; i < groups.length; i++) {
                    var center = LatLonCenter(groups[i])
                    series.push({
                        id: "idi" + i.toString(),
                        lat: center[0],
                        lon: center[1],
                        drilldown: "id" + i.toString()
                    })

                    drillseries.push({
                        id: "id" + i.toString(),
                        name: "id" + i.toString(),
                        data: groups[i],
                        type: 'mappoint',
                        name: 'Hotels',
                        colorByPoint: true,
                    })
                }

                // Add data to chart
                chart.series[1].setData(series, true, true, true)
                chart.options.drilldown.series = drillseries
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