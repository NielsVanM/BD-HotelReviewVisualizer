from tables import *

class ReactorReading(IsDescription):
    name = StringCol(16)
    uid = StringCol(32)
    fuel_level = Int64Col()
    energy_output = Int64Col()
    core_temperature = Int64Col()
    coolant_temperature = Float64Col() 
