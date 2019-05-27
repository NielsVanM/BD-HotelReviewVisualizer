from DataLoader.apps import _Mongo
from bson.code import Code

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
    hotel_name_list = []
    coordinates = []
    for doc in ReviewDB.find({}, {"lat", "lng", "Hotel_Name"}):
        
        if doc["Hotel_Name"] in hotel_name_list:
            continue

        hotel_name_list.append(doc["Hotel_Name"])
        coordinates.append(doc)

    return coordinates