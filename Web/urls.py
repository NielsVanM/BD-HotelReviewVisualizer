from django.urls import path
from .views import *

urlpatterns = [
    path("", DashboardView.as_view(), name="dashboard"),
    path("data/", DataView, name="data-endpoint"),
    path("pytable/", PyTableView.as_view(), name="pytable"),
    path("pytable/loadall/", LoadTooMuchData, name="toomuchdata"),
    path("pytable/coretemp/", GetAvgCoreTemperature)
]
