import json

from chartit import Chart
from django.shortcuts import HttpResponse, render
from django.views.generic import TemplateView
from bson.json_util import dumps

from .datafunctions import GetPosNegCount, GetHotelCoordinates
from DataLoader.apps import _Mongo

# Create your views here.


class DashboardView(TemplateView):
    template_name = "dashboard.html"

def DataView(request):
    chart = request.GET.get("chart", None)
    if chart == None:
        return HttpResponse("Invalid Request, no chart provided")

    if chart == "posnegdistribution":
        return HttpResponse(json.dumps(GetPosNegCount()))

    if chart == "hotelmap":
        return HttpResponse(dumps(GetHotelCoordinates()))

    return
