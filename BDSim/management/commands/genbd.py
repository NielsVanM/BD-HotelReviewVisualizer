import datetime
import random
import os
import uuid

from django.core.management.base import BaseCommand
from django.utils import timezone
from tables import *

from BDSim.descriptors import ReactorReading


class Command(BaseCommand):
    help = 'Parses the kaggle dataset '

    def add_arguments(self, parser):
        parser.add_argument('size', type=int, help='Size in GB to generate')

    def handle(self, *args, **kwargs):
        size = kwargs["size"]

        print("Generating {}GB of data".format(size))

        h5file = open_file("Data/reactor_data.h5", mode="w",
                           title="Reactor Readings")
        group = h5file.create_group("/", 'analytics', 'Reactor analytics')
        table = h5file.create_table(
            group, 'readout', ReactorReading, 'Reactor Readouts')

        prev = None
        while True:
            info = os.stat("Data/reactor_data.h5")

            # Check if size is larger than provided size in GB
            if info.st_size > size * 1024 * 1024 * 1024:
                break

            else:
                # Print in GB
                print("Currently at {} GB".format(
                    info.st_size / 1024 / 1024 / 1024
                ))

            # Generate another 100 000 rows
            prev = self.genData(table, prev)

            table.flush()

        print("Finshed generating")

        h5file.close()

    def genData(self, table, prev):
        reading = table.row

        if prev == None:
            prev = self.genReading(reading, None, 0)
            prev.append()
            table.flush()

            print(prev)

        for i in range(1000000):
            reading = self.genReading(reading, prev, i)
            reading.append()
            prev = reading

        return reading

    def genReading(self, reading, prev, ite):

        if prev != None:
            reading["name"] = "Reactor01"
            reading["uid"] = "00"
            reading["fuel_level"] = prev["fuel_level"] + random.randrange(-10, 0)

            new_energy = prev["energy_output"] + random.randrange(-10, 10)
            if new_energy <= 0:
                reading["energy_output"] = new_energy
            else:
                reading["energy_output"] = new_energy * -1
            
            reading["core_temperature"] = prev["energy_output"] + \
                random.randrange(-10, 10)
            reading["coolant_temperature"] = prev["coolant_temperature"] + \
                random.randrange(-1, 1)
            
        else:
            reading["name"] = "Reactor01"
            reading["uid"] = "00"
            reading["fuel_level"] = 1000000
            reading["energy_output"] = 0
            reading["core_temperature"] = 20
            reading["coolant_temperature"] = 20
        
        return reading
