var ChartList = []
var CurrentFilters = {}


// Sets up thy visualizations
$(document).ready(function () {
    
    var ReviewTime = new ReviewOverTimeVis("reviewovertime")
    // ReviewTime.update(CurrentFilters)
    ChartList.push(ReviewTime)
    
    var HotelMap = new HotelMapVis("chart")
    // HotelMap.update(CurrentFilters)
    ChartList.push(HotelMap)

    var ReviewByNationality = new ReviewByNationalityVis("piechart")
    // ReviewByNationality.update(CurrentFilters)
    ChartList.push(ReviewByNationality)

    UpdateCharts(null, CurrentFilters)
})