// Sets up thye visualizations
$(document).ready(function () {
    var chartList = []

    var ReviewTime = new ReviewOverTimeVis("reviewovertime")
    ReviewTime.update({})
    chartList.push(ReviewTime)

    var HotelMap = new HotelMapVis("chart")
    HotelMap.update({})
    chartList.push(HotelMap)

    var ReviewByNationality = new ReviewByNationalityVis("piechart")
    ReviewByNationality.update({})
    chartList.push(ReviewByNationality)

    chartList.forEach(chart => {
        chart.setOtherCharts(chartList)
    });

})