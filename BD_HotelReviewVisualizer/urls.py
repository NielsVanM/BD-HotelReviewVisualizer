from django.contrib import admin
from django.urls import path, include

import DataLoader

urlpatterns = [
    path("", include("Web.urls")),
    path("", include("Spark.urls")),
    path('admin/', admin.site.urls),
]
