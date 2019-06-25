import os

from django.apps import AppConfig
from pyspark import SparkConf, SparkContext

SparkURL = "spark://10.5.0.5:7077"


global _SC
_SC = None

    
class SparkConfig(AppConfig):
    name = 'Spark'

    def ready(self):
        global _SC
        c = SparkConf()
        c.setMaster(SparkURL)
        c.set("spark.mongodb.input.uri", "mongodb://127.0.0.1/Hotel_Reviews.tiny_reviews?readPreference=primaryPreferred")
        c.set("spark.mongodb.output.uri", "mongodb://127.0.0.1/Hotel_Reviews.tiny_reviews")
        c.set("org.mongodb.spark", "mongo-spark-connector_2.11:2.0.2")
    
        _SC = SparkContext(conf=c)

        if _SC != None:
            print("Connected to spark cluster")
        else:
            print('Failed to connect to spark cluster')
            os.exit(-1)
