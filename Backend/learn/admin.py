from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(UploadedImage)
admin.site.register(Doctor)
admin.site.register(EditReport)
admin.site.register(Report)
admin.site.register(history)