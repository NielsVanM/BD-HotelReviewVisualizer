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


def GetHotelCoordinates():
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


def GetReviewOverTime():
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
        }"""), "res")

    data = []
    for doc in res.find():
        date = datetime.strptime(doc["_id"], "%m/%d/%Y")

        data.append([
            str(date),
            doc["value"]
        ])

    return data


def GetAverageScorePerReviewerCountry():
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
