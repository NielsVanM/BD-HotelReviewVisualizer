
var MapVisualization = null
var ReviewTimeVisualization = null

function UpdateReviewOverTime(argumen) {
    if (argumen == undefined) {
        console.error("Invalid argument provided")
        return
    }

    // Show loading
    ReviewTimeVisualization.showLoading()

    argumen["chart"] = "reviewovertime"

    // Request data
    $.ajax({
        type: "GET",
        url: "/data/?" + paramString(argumen),
        success: function (res) {
            data = JSON.parse(res)
            data.forEach(entry => {
                entry[0] = Date.parse(entry[0])
            });

            ReviewTimeVisualization.series[0].setData(data, true, true, true)
            ReviewTimeVisualization.hideLoading()
        },
    })
}

function paramString(object) {
    var strBuilder = [];
    for (var key in object) if (object.hasOwnProperty(key)) {
        strBuilder.push(encodeURIComponent(key) + '=' + encodeURIComponent(object[key]));
    }
    return strBuilder.join('&');
}

function isNear(source, target, sensitivity) {
    // Check latutide Axis
    if (Math.abs(source.lat - target.lat) <= sensitivity) {
        // Check longitude Axis
        if (Math.abs(source.lon - target.lon) <= sensitivity) {
            return true
        }
    }

    return false
}

function GroupHotels(hotellist) {
    // Groups hotels based on their lat/long, returns a list of drilldowns that can be used in the chart
    data = []

    var targethotel = null

    // Loop as long as we still have hotels left to group
    while (hotellist.length > 0) {
        // Create empty group list and set the targethotel to the
        // first entry in the list
        currentHotelList = []
        targethotel = hotellist[0]

        // Add targethotel to the group
        currentHotelList.push(targethotel)
        for (var i = 0; i < hotellist.length; i++) {
            var hotel = hotellist[i]
            // Check if near, if it is, add it to the current group list, remove it
            // from the hotellist and decrease the iterator
            if (isNear(targethotel, hotel, 2)) {
                currentHotelList.push(hotel)
                hotellist.splice(i, 1)
                i--
                continue
            }
        }

        // Remove the currenthotel from the list
        hotellist.splice(0, 1)

        // Add group to data
        data.push(currentHotelList)
    }

    return data
}

// Calculates the latitude/longitude center of a group provided by
// GroupHotels()
function LatLonCenter(group) {

    var totalLat = 0
    var totalLon = 0
    for (var i = 0; i < group.length; i++) {
        totalLat += group[i].lat
        totalLon += group[i].lon
    }

    return [totalLat / group.length, totalLon / group.length]
}

function MapChart() {
    // Map with all the hotels scattered across the map    
    var MapVisualization = Highcharts.mapChart('chart', {
        chart: {
            map: 'custom/europe',
            events: {
                // Filter the reviewovertime chart with the currently
                // visible hotels
                drilldown: function (e) {
                    // Extract the hotel names
                    var hotelNames = []
                    e.seriesOptions.data.forEach(hotel => {
                        hotelNames.push(hotel.name)
                    });

                    UpdateReviewOverTime({ "hotelnames": hotelNames })
                },

                // Reset the filter on the reviewovertimechart
                drillup: function (e) {
                    UpdateReviewOverTime({})
                }
            }
        },
        title: {
            text: 'Hotels with reviews'
        },
        mapNavigation: {
            enabled: true
        },
        plotOptions: {
            series: {
                point: {
                    events: {
                        click: function (e) {
                            // Return if the click was a drilldown
                            if (this.name == undefined) {
                                return false
                            }
                            UpdateReviewOverTime({"hotelnames": this.name})
                            return false
                        }
                    }
                }
            },
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

    MapVisualization.showLoading()
    $.ajax({
        type: "GET",
        url: "/data/?" + paramString({ "chart": "hotelmap" }),
        success: function (res) {
            data = JSON.parse(res)
            realdata = []

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
            groups = GroupHotels(realdata)

            // Create drilldowns based on groups
            series = []
            drillseries = [{
                name: 'Basemap',
                borderColor: '#BBBBBB',
                nullColor: 'rgba(200, 200, 200, 0.3)',
                showInLegend: false
            }]
            for (var i = 0; i < groups.length; i++) {
                center = LatLonCenter(groups[i])
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
            MapVisualization.series[1].setData(series, true, true, true)
            MapVisualization.options.drilldown.series = drillseries
            MapVisualization.hideLoading()
        },
    })
}

function ReviewOverTimeChart() {
    ReviewTimeVisualization = Highcharts.chart('reviewovertime', {
        chart: {
            zoomType: "x",
        },

        title: {
            text: "Amount of reviews over time."
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

    UpdateReviewOverTime({})
}

$(document).ready(function () {
    MapChart()
    ReviewOverTimeChart()
    // ScoreByCountryMap()
})