
var MapVisualization = null
var ReviewTimeVisualization = null
var ReviewPerCountryVisualization = null

function UpdateReviewOverTime(arg) {
    if (arg == undefined) {
        console.error("Invalid argument provided")
        return
    }

    // Show loading
    ReviewTimeVisualization.showLoading()

    arg["chart"] = "reviewovertime"

    // Request data
    $.ajax({
        type: "GET",
        url: "/data/?" + paramString(arg),
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

function UpdateHotelMap(arg) {
    if (arg == undefined) {
        console.error("Invalid argument provided")
        return
    }

    arg["chart"] = "hotelmap"

    MapVisualization.showLoading()
    $.ajax({
        type: "GET",
        url: "/data/?" + paramString(arg),
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

function UpdateReviewsPerNationality(arg) {
    if (arg == undefined) {
        console.error("Invalid argument provided")
        return
    }

    arg["chart"] = "reviewpernationality"

    ReviewPerCountryVisualization.showLoading()

    $.ajax({
        type: "GET",
        url: "/data/?" + paramString(arg),
        success: function(res) {
            data = JSON.parse(res)

            ReviewPerCountryVisualization.series[0].setData(data, true, true, true)
            ReviewPerCountryVisualization.hideLoading()
        }
    })

}

function UpdateVisualizations(arg) {
    // UpdateHotelMap(arg)
    UpdateReviewOverTime(arg)
    UpdateReviewsPerNationality(arg)
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
    MapVisualization = Highcharts.mapChart('chart', {
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

                    UpdateVisualizations({ "hotelnames": hotelNames })
                },

                // Reset the filter on the reviewovertimechart
                drillup: function (e) {
                    UpdateVisualizations({})
                }
            }
        },
        title: {
            text: 'Hotels'
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
                            UpdateVisualizations({"hotelnames": this.name})
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

    UpdateHotelMap({})

}

function ReviewOverTimeChart() {
    ReviewTimeVisualization = Highcharts.chart('reviewovertime', {
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

    UpdateReviewOverTime({})
}

function ReviewByNationality() {
    ReviewPerCountryVisualization = Highcharts.chart('piechart', {
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
                // allowPointSelect: true,
                cursor: 'pointer',
                innerSize: 150,
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y}',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            },
            series: {
                turboThreshold: 10000,
                events: {
                    click: function(event) {
                        console.log(this)
                    }
                }
            }
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: []
        }]
    });

    UpdateReviewsPerNationality({})
}

$(document).ready(function () {
    MapChart()
    ReviewOverTimeChart()
    ReviewByNationality()
})