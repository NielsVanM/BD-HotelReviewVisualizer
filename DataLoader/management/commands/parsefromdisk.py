from django.core.management.base import BaseCommand
from django.utils import timezone
from DataLoader.kaggleparser import ParseKaggleFile

class Command(BaseCommand):
    help = 'Parses the kaggle dataset '

    def add_arguments(self, parser):
        parser.add_argument('path', type=str, help='The path where the kaggle file is located')

    def handle(self, *args, **kwargs):
        path = kwargs["path"]

        data = None
        try:
            print("Opening {}".format(path))
            with open(path) as f:
                data = f.readlines()

            ParseKaggleFile(data)

        
        except FileNotFoundError:
            print("Invalid path provided")