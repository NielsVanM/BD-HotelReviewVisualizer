import json

from django.shortcuts import HttpResponse
from django.views.generic import TemplateView
from bson.json_util import dumps

from .datafunctions import GetHotelCoordinates, GetReviewOverTime,GetAmountOfReviewsPerNationality
from DataLoader.apps import _Mongo

# Create your views here.


class DashboardView(TemplateView):
    template_name = "dashboard.html"

class PyTableView(TemplateView):
    template_name = "base.html"

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
