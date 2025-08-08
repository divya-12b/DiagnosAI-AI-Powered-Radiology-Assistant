from django.urls import path
from .views import *

urlpatterns=[
    path("register/",RegisterView.as_view(),name='register'),
    path("login/",LoginView.as_view(),name='login'),
    path('upload/', ImageUploadView.as_view(), name='image-upload'),
    path('editreport/',EditreportView.as_view(),name='editreport'),
    path('doctor/<slug:category>/action/',DoctorView.as_view(),name='doctor'),
    path('viewreport/',ViewReportView.as_view(),name='viewreport'),
    path('update/',UpdateUserView.as_view(),name='update'),
    path('viewuser/',ViewUserView.as_view(),name='viewuser'),
    path('detailreport/<slug:category>/action/',ViewDetailreportView.as_view(),name='detailreport'),
    path('history/',HistoryView.as_view(),name='history'),
    path('viewhistory/',ViewHistoryView.as_view(),name='viewhistory')
]
