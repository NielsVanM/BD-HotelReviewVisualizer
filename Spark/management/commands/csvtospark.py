import pandas as pd
from django.core.management.base import BaseCommand
from pyspark.sql import SparkSession, SQLContext
from Spark.apps import _SC


class Command(BaseCommand):
    help = 'Parses the kaggle dataset '

    def add_arguments(self, parser):
        parser.add_argument(
            'path', type=str, help='The path where the kaggle file is located')

    def handle(self, *args, **kwargs):
        path = kwargs["path"]
        print("Uploading ...")
        sql_sc = SQLContext(_SC)

        df = pd.read_csv(path)
        s_df = sql_sc.createDataFrame(df)
        print("Finished uploading")
