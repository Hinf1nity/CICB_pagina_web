from django.urls import path, include

urlpatterns = [
    path('users/', include('users.urls')),
    path('news/', include('news.urls')),
    path('jobs/', include('jobs.urls')),
    path('regulation/', include('regulation.urls')),
    path('calls/', include('calls.urls')),
    path('yearbooks/', include('yearbooks.urls')),
    path('pdfs/', include('PDFs.urls')),
    path('imgs/', include('IMGs.urls')),
    path('performance_chart/', include('performance_chart.urls')),
    path('resource_chart/', include('resource_chart.urls')),
]
