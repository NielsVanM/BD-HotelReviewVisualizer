from django.urls import path
from .views import DashboardView, DataView, PyTableView

urlpatterns = [
    path("", DashboardView.as_view(), name="dashboard"),
    path("data/", DataView, name="data-endpoint"),
    path("pytable/", PyTableView.as_view(), name="pytable")
]
