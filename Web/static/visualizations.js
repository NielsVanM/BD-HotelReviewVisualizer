
function paramString(object) {
    var strBuilder = [];
    for (var key in object) if (object.hasOwnProperty(key)) {
        strBuilder.push(encodeURIComponent(key) + '=' + encodeURIComponent(object[key]));
    }
    return strBuilder.join('&');
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
            color: "blue",
            data: [{
                "id": "Dummy",
                "lon": 0,
                "lat": 0
            }]
        }]
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
            
            chart.series[1].setData(realdata, true, true, true)
            chart.hideLoading()
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
                data: [[20, 20],[20,20]]
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
    ScoreByCountryMap()
})