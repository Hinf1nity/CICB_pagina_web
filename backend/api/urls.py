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
    path('stats/', include('stats.urls')),
    path('performance/', include('performance_table.urls')),
    path('civil_salary/', include('civil_salary.urls')),
]
