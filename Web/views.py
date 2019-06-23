import json
import os

from django.shortcuts import HttpResponse
from django.views.generic import TemplateView
from bson.json_util import dumps
from tables import open_file

from .datafunctions import GetHotelCoordinates, GetReviewOverTime,GetAmountOfReviewsPerNationality
from DataLoader.apps import _Mongo

class DashboardView(TemplateView):
    template_name = "dashboard.html"

class PyTableView(TemplateView):
    template_name = "pytable.html"

    def get_context_data(self):
        h5 = open_file("Data/reactor_data.h5", "r")
        table = h5.root.analytics.readout

        out = {
            "file_size": int(os.stat("Data/reactor_data.h5").st_size /1024/1024/1024),
            "rows": table.nrows,
            "cols": table.colnames
        }

        h5.close()

        return out

def DataView(request):
    chart = request.GET.get("chart", None)
    res = None      

    if chart == "hotelmap":
        res = GetHotelCoordinates(request)
    
    if chart == "reviewovertime":
        res = GetReviewOverTime(request)
    
    if chart == "reviewpernationality":
        res = GetAmountOfReviewsPerNationality(request)

    if res != None:
        return HttpResponse(
            dumps(res)
        )
    return HttpResponse("Invalid Request, no known chart provided")

def LoadTooMuchData(request):
    with open("Data/reactor_data.h5") as f:
        dataset = f.read()

def GetAvgCoreTemperature(request):
    
    h5 = open_file("Data/reactor_data.h5", 'r')
    table = h5.root.analytics.readout
    # Calculate core temp average
    total = 0
    count = 0
    min = 0
    max = 0
    for x in table.iterrows():
        temp = x["core_temperature"]
        total += temp
        count += 1

        if temp < min:
            min = temp
        if temp > max:
            max = temp
    
    return HttpResponse(
        json.dumps(
            {
                "average": total/count,
                "min": min,
                "max": max
            }
        )
    )

