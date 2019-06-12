import json

from django.shortcuts import HttpResponse
from django.views.generic import TemplateView
from bson.json_util import dumps

from .datafunctions import GetPosNegCount, GetHotelCoordinates, GetReviewOverTime, GetAverageScorePerReviewerCountry, GetAmountOfReviewsPerNationality
from DataLoader.apps import _Mongo

# Create your views here.


class DashboardView(TemplateView):
    template_name = "dashboard.html"

def DataView(request):
    chart = request.GET.get("chart", None)
    res = None
    if chart == None:
        return HttpResponse("Invalid Request, no chart provided")

    if chart == "hotelmap":
        res = GetHotelCoordinates(request)
    
    if chart == "reviewovertime":
        res = GetReviewOverTime(request)
    
    if chart == "scorepernationality":
        res = GetAverageScorePerReviewerCountry(request)
    
    if chart == "reviewpernationality":
        res = GetAmountOfReviewsPerNationality(request)

    return HttpResponse(
        dumps(res)
    )
