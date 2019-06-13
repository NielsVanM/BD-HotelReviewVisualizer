from DataLoader.apps import _Mongo
from bson.code import Code
from datetime import datetime

ReviewDB = _Mongo.full_reviews
TinyReviewDB = _Mongo.tiny_reviews

_argToFieldMap = {
    "hotelnames": "Hotel_Name"
}


def _processArgs(request, keys):
    filterQuery = {}
    for key in keys:
        val = request.GET.get(key)
        if val != None:
            filterQuery[key] = val.split(",")

    return filterQuery


def _buildFilter(args):
    pass


def GetHotelCoordinates(request):
    countryFilter = request.GET.get("countries")
    pipeline = []
    if countryFilter != None:
        pipeline.append({
            "$match": {
                "Reviewer_Nationality": {
                    "$in": countryFilter.split(",")
                }
            }
        })

    pipeline.append(
        {"$group":
            {"_id": {
                "name": "$Hotel_Name",
                "lat": "$lat",
                "lon": "$lng"
            }
            }
         }
    )

    res = ReviewDB.aggregate(pipeline)

    return res


def GetReviewOverTime(request):
    hotelNameFilter = request.GET.get("hotelnames")
    countryFilter = request.GET.get("countries")

    fq = {}
    if hotelNameFilter != None:
        fq["Hotel_Name"] = {"$in": hotelNameFilter.split(",")}

    if countryFilter != None:
        fq["Reviewer_Nationality"] = {"$in": countryFilter.split(",")}

    if fq == {}:
        fq = None

    res = ReviewDB.map_reduce(
        Code("""
        function() {
            emit(this.Review_Date, 1)
        }"""),
        Code("""
        function(key, values) {
            var total = 0
            for (var i = 0; i < values.length; i++) {
                total += values[i]
            }
            return total
        }"""), "res", query=fq)

    dataSet = res.find()

    data = []
    for doc in dataSet:
        date = datetime.strptime(doc["_id"], "%m/%d/%Y")

        data.append([
            str(date),
            doc["value"]
        ])

    return data


def GetAmountOfReviewsPerNationality(request):
    hotelNameFilter = request.GET.get("hotelnames")

    fq = None
    if hotelNameFilter != None:
        fq = {"Hotel_Name": {"$in": hotelNameFilter.split(",")}}

    res = ReviewDB.map_reduce(
        Code("""
            function() {
                emit(this.Reviewer_Nationality, 2)
            }
        """),
        Code("""
            function(key, values) {
                var total = 0
                for (var i = 0; i < values.length; i ++) {
                    total += values[i]
                }
                return total
            }
        """), "out", query=fq)

    out = []
    for doc in res.find():
        out.append({
            "name": doc["_id"],
            "y": doc["value"]
        })

    return out[1:]
