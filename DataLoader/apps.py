from django.apps import AppConfig
import pymongo
from DataLoader.mongodb import ConnectToDB

global _Mongo
_Mongo = None

class DataloaderConfig(AppConfig):
    name = 'DataLoader'

    def ready(self):
        global _Mongo

        print("Connecting to MongoDB server")
        _Mongo = ConnectToDB("localhost", 27017, "", "")

        if _Mongo == None:
            raise ValueError("_Mongo is None")
