from django.urls import path
from .views import DashboardView, DataView

urlpatterns = [
    path("", DashboardView.as_view(), name="dashboard"),
    path("data/", DataView, name="data-endpoint")
]
