from pymongo import MongoClient

MongoConnectionTimeout = 10

def ConnectToDB(host, port, user, passw):
    client = MongoClient(host, port, serverSelectionTimeoutMS=MongoConnectionTimeout)
    db = client.get_database(name="hotel_reviews")

    return db