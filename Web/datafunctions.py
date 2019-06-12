from DataLoader.apps import _Mongo
from bson.code import Code
from datetime import datetime

ReviewDB = _Mongo.full_reviews
TinyReviewDB = _Mongo.tiny_reviews


def GetPosNegCount():
    posReviewCount = TinyReviewDB.count_documents({"positive": True})
    negReviewCount = TinyReviewDB.count_documents({"positive": False})

    return {
        "posReviewCount": posReviewCount,
        "negReviewCount": negReviewCount
    }


def GetHotelCoordinates(request):
    pipeline = [
        {"$group":
            {"_id": {
                "name": "$Hotel_Name",
                "lat": "$lat",
                "lon": "$lng"
                }
            }
        }
    ]

    res = ReviewDB.aggregate(pipeline)

    return res


def GetReviewOverTime(request):
    hotelNameFilter = request.GET.get("hotelnames")

    fq = None
    if hotelNameFilter != None:
        fq = {"Hotel_Name": {"$in": hotelNameFilter.split(",")}}

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


def GetAverageScorePerReviewerCountry(request):
    res = ReviewDB.map_reduce(
        Code("""
            function() {
                emit(this.Reviewer_Nationality, this.Reviewer_Score)
            }
        """),
        Code("""
            function(key, values) {
                var total = 0
                var count = 0
                for (var i = 0; i < values.length; i++) {
                    total += parseInt(values[i])
                    count ++
                }

                return parseInt((total / count) * 100) / 100
            }
        """), "resultset")

    out = []
    for doc in res.find():
        if doc["_id"] == " ":
            continue

        out.append({
            "code": doc["_id"],
            "value": doc["value"]
        })

    return out

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