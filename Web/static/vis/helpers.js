// paramString converts an object to a url encoded string
function paramString(object) {
    var strBuilder = [];
    for (var key in object) if (object.hasOwnProperty(key)) {
        strBuilder.push(encodeURIComponent(key) + '=' + encodeURIComponent(object[key]));
    }
    return strBuilder.join('&');
}

// isNear calculates the distance between a source and target hotel and returns true
// if it's lower than the sensitivitiy, else it returns false
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

// Groups a list of hotels by their coordinates, returns a list of groups
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