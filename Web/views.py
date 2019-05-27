import json

from django.shortcuts import HttpResponse, render
from django.views.generic import TemplateView
from bson.json_util import dumps

from .datafunctions import GetPosNegCount, GetHotelCoordinates, GetReviewOverTime, GetAverageScorePerReviewerCountry
from DataLoader.apps import _Mongo

# Create your views here.


class DashboardView(TemplateView):
    template_name = "dashboard.html"

def DataView(request):
    chart = request.GET.get("chart", None)
    if chart == None:
        return HttpResponse("Invalid Request, no chart provided")

    if chart == "hotelmap":
        return HttpResponse(dumps(GetHotelCoordinates()))
    
    if chart == "reviewovertime":
        return HttpResponse(dumps(GetReviewOverTime()))
    
    if chart == "scorepernationality":
        return HttpResponse(dumps(GetAverageScorePerReviewerCountry()))

    return HttpResponse(None)
