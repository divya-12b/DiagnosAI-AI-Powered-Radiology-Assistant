from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import *
from rest_framework_simplejwt.tokens import RefreshToken

User=get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True)
    confirm=serializers.CharField(write_only=True)
    image=serializers.ImageField(required=False,allow_null=True)

    class Meta:
        model=User
        fields='__all__'
    
    def validate_email(self,value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email Already Exists')
        return value
    def validate(self,data):
        password=data.get('password')
        confirm=data.get('confirm')

        if password!=confirm :
            raise serializers.ValidationError('Both Passwords Does Not Match')
        return data
    
    def create(self,validated_data):
        validated_data.pop('confirm',None)
        image=validated_data.get('image',None)
        user=User.objects.create_user(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password'],
            image=image
        )
        return user
    
class LoginSerializer(serializers.ModelSerializer):
    email=serializers.CharField()
    password=serializers.CharField(write_only=True)

    class Meta:
        model=User
        fields=['email','password']

    def validate(self,data):
        email=data.get('email')
        password=data.get('password')

        try:
            user=User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid Email')
        
        if not user.check_password(password):
            raise serializers.ValidationError('Invalid Password')
        
        refresh=RefreshToken.for_user(user)
        access_token=str(refresh.access_token)
        
        data['user']=user
        data['refresh_token']=str(refresh)
        data['access_token']=access_token



        return data
    

class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ('image','category')
    
class EditreportSerializer(serializers.ModelSerializer):
    class Meta:
        model= EditReport
        fields='__all__'
    
    def get_image(self,img):
        request=self.context.get('request')
        if img.image:
            return request.build_absolute_uri(img.image.url) if img.image else img
        else:
            None
class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Doctor
        fields='__all__'
    
class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['first_name','last_name','username','email','age']
class ViewuserSerializer(serializers.ModelSerializer):
    image=serializers.SerializerMethodField()
    class Meta:
        model=Customuser
        fields='__all__'
    
    def get_image(self,img):
        request=self.context.get('request')
        if img.image:
            return request.build_absolute_uri(img.image.url) 
        return None

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model=Report
        fields='__all__'
    
class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model=history
        fields='__all__'