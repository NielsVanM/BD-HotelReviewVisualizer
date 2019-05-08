from django.shortcuts import render
from django.views.static import HttpResponse
from django.shortcuts import render

# Create your views here.
def MyView(request):
    return render(request, "upload_files.html")