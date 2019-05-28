
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
    var chart = Highcharts.mapChart('chart', {
        chart: {
            map: 'custom/europe'
        },
        title: {
            text: 'Hotels with reviews'
        },
        mapNavigation: {
            enabled: true
        },
        plotOptions: {
            series: {
                boostThreshold: 100,
                turboThreshold: 0
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
        }
    });

    chart.showLoading()
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
            chart.series[1].setData(series, true, true, true)
            chart.options.drilldown.series = drillseries
            chart.hideLoading()
            console.log(drillseries)
            // console.log(chart.options.drilldown.series)
        },
    })
}

function ReviewOverTimeChart() {
    chart = Highcharts.chart('reviewovertime', {
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

    chart.showLoading()
    $.ajax({
        type: "GET",
        url: "/data/?" + paramString({ "chart": "reviewovertime" }),
        success: function (res) {
            data = JSON.parse(res)
            data.forEach(entry => {
                entry[0] = Date.parse(entry[0])
            });

            chart.series[0].setData(data, true, true, true)
            chart.hideLoading()
        },
    })
}

function ScoreByCountryMap() {
    var chart = Highcharts.mapChart('scorebynationalitymap', {
        chart: {
            map: 'custom/europe'
        },
        title: {
            text: 'Average score per nationality'
        },
        mapNavigation: {
            enabled: true
        },
        plotOptions: {
            series: {
                boostThreshold: 2000,
                turboThreshold: 0
            },
        },

        legend: {
            layout: 'horizontal',
            borderWidth: 0,
            backgroundColor: 'rgba(255,255,255,0.85)',
            floating: true,
            verticalAlign: 'top',
            y: 25
        },
        series: [{
            name: 'Basemap',
            borderColor: '#BBBBBB',
            nullColor: 'rgba(200, 200, 200, 0.3)',
            showInLegend: false
        }, {
            type: 'mappoint',
            name: 'Scores',
            color: Highcharts.getOptions().colors[1],
            data: null,
            joinBy: ['nationality', 'name']
        }]
    });

    chart.showLoading()
    $.ajax({
        type: "GET",
        url: "/data/?" + paramString({ "chart": "scorepernationality" }),
        success: function (res) {
            data = JSON.parse(res)

            data.forEach(country => {
                // console.log(getCountryName(country["code"]))
                country["code"] = getCountryName(country["code"])
            });

            chart.series[1].setData(data, true, true, true)
            chart.hideLoading()
        },
    })
}

$(document).ready(function () {
    MapChart()
    ReviewOverTimeChart()
    // ScoreByCountryMap()
})