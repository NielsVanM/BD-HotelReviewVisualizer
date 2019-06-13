var ChartList = []

// Sets up thy visualizations
$(document).ready(function () {
    var ReviewTime = new ReviewOverTimeVis("reviewovertime")
    ReviewTime.update({})
    ChartList.push(ReviewTime)

    var HotelMap = new HotelMapVis("chart")
    HotelMap.update({})
    ChartList.push(HotelMap)

    var ReviewByNationality = new ReviewByNationalityVis("piechart")
    ReviewByNationality.update({})
    ChartList.push(ReviewByNationality)
})