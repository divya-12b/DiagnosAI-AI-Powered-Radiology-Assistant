# from django.db import models
# from django.contrib.auth.models import AbstractUser


# class Customuser(AbstractUser):
#     age=models.IntegerField(null=False,blank=False,default='18')
#     image=models.ImageField(max_length=255,upload_to='profile/',null=False,blank=False,default=False)

# class UploadedImage(models.Model):
#     image = models.ImageField(upload_to='uploads/')
#     category=models.CharField(max_length=10,null=False ,blank=True)
#     uploaded_at = models.DateTimeField(auto_now_add=True)
# class EditReport(models.Model):
#     user=models.ForeignKey(Customuser,on_delete=models.CASCADE)
#     name=models.CharField(max_length=100,null=False,blank=False)
#     additional=models.CharField(max_length=255,null=True,blank=True)
#     desc=models.CharField(max_length=255,null=True,blank=True)
#     detected=models.CharField(max_length=100,null=False,blank=False)
#     created_at=models.DateTimeField(auto_now_add=True)
    
# class Doctor(models.Model):
#     STATUS_CHOICES=[
#         ('brain','Brain'),
#         ('kidney','Kidney'),
#         ('lung','Lung')
#     ]
#     category=models.CharField(max_length=10,choices=STATUS_CHOICES,default=False)
#     name=models.CharField(max_length=255,blank=False,null=False)



# class Report(models.Model):
#     STATUS_CHOICES=[
#         ('brain','Brain'),
#         ('kidney','Kidney'),
#         ('lung','Lung')
#     ]
#     category=models.CharField(max_length=20,choices=STATUS_CHOICES,default=False)
#     symptoms=models.CharField(max_length=255,blank=True,null=True)
#     diagnosis=models.CharField(max_length=255,blank=True,null=True)
#     medication=models.CharField(max_length=255,blank=True,null=True)
#     home=models.CharField(max_length=255,blank=True,null=True)
#     desc=models.CharField(max_length=255,blank=True,null=True)
#     treat=models.CharField(max_length=255,blank=True,null=True)

# class history(models.Model):
#     user=models.ForeignKey(Customuser,on_delete=models.CASCADE,related_name='user',null=True,blank=True)
#     name=models.CharField(max_length=250,null=False,blank=False,default='hari')
#     image=models.CharField(max_length=255)
#     predict=models.CharField(max_length=100,null=False,blank=False,default='hari')
#     sym=models.CharField(max_length=100,null=False,blank=False,default='hari')

from django.db import models
from django.contrib.auth.models import AbstractUser


class Customuser(AbstractUser):
    age=models.IntegerField(null=False,blank=False,default='18')
    image=models.ImageField(max_length=255,upload_to='profile/',null=True,blank=True,default=False)

class UploadedImage(models.Model):
    image = models.ImageField(upload_to='uploads/')
    category=models.CharField(max_length=10,null=False ,blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
class EditReport(models.Model):
    user=models.ForeignKey(Customuser,on_delete=models.CASCADE)
    name=models.CharField(max_length=100,null=False,blank=False)
    additional=models.CharField(max_length=255,null=True,blank=True)
    desc=models.CharField(max_length=255,null=True,blank=True)
    detected=models.CharField(max_length=100,null=False,blank=False)
    created_at=models.DateTimeField(auto_now_add=True)
    
class Doctor(models.Model):
    STATUS_CHOICES=[
        ('brain','Brain'),
        ('kidney','Kidney'),
        ('lung','Lung')
    ]
    category=models.CharField(max_length=10,choices=STATUS_CHOICES,default=False)
    name=models.CharField(max_length=255,blank=False,null=False)



class Report(models.Model):
    STATUS_CHOICES=[
        ('brain','Brain'),
        ('kidney','Kidney'),
        ('lung','Lung')
    ]
    category=models.CharField(max_length=20,choices=STATUS_CHOICES,default=False)
    symptoms=models.CharField(max_length=255,blank=True,null=True)
    diagnosis=models.CharField(max_length=255,blank=True,null=True)
    medication=models.CharField(max_length=255,blank=True,null=True)
    home=models.CharField(max_length=255,blank=True,null=True)
    desc=models.CharField(max_length=255,blank=True,null=True)
    treat=models.CharField(max_length=255,blank=True,null=True)

class history(models.Model):
    user=models.ForeignKey(Customuser,on_delete=models.CASCADE,related_name='user',null=True,blank=True)
    name=models.CharField(max_length=250,null=False,blank=False,default='hari')
    image=models.CharField(max_length=255)
    predict=models.CharField(max_length=100,null=False,blank=False,default='hari')
    sym=models.CharField(max_length=100,null=False,blank=False,default='hari')