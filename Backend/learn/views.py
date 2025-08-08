from rest_framework.views import APIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from .serailizers import *
from random import choice

class RegisterView(APIView):
    permission_classes=[AllowAny]
    

    def post(self,request):
        print(self.permission_classes)

        serializer=RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"res":"Registered Successfully"},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
class LoginView(APIView):
    permission_classes=[AllowAny]
    

    def post(self,request):
        print(self.permission_classes)

        serializer=LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response({"res":"Login Successfully",
                             "user_id":serializer.validated_data["user"].id,
                             "access_token":serializer.validated_data['access_token'],
                             'refresh_token':serializer.validated_data['refresh_token']},

                             status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    




# import torch
# import torch.nn as nn
# from torchvision import transforms, models
# from PIL import Image
# import numpy as np
# import cv2
# import os
# from django.conf import settings
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from .models import UploadedImage
# from django.core.files.storage import default_storage

# # Device Configuration
# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# # Define MobileNet Model (Relevance Detection)
# class MobileNetModel(nn.Module):
#     def __init__(self, num_classes):
#         super(MobileNetModel, self).__init__()
#         self.mobilenet = models.mobilenet_v2(pretrained=True)
#         num_features = self.mobilenet.classifier[1].in_features
#         self.mobilenet.classifier[1] = nn.Linear(num_features, num_classes)

#     def forward(self, x):
#         return self.mobilenet(x)

# # Define DenseNet Model (Classification)
# class DenseNetModel(nn.Module):
#     def __init__(self, num_classes):
#         super(DenseNetModel, self).__init__()
#         self.densenet = models.densenet121(pretrained=False)
#         num_features = self.densenet.classifier.in_features
#         self.densenet.classifier = nn.Linear(num_features, num_classes)

#     def forward(self, x):
#         return self.densenet(x)

# # Load Models for Brain Classification
# common_mobilenet = MobileNetModel(num_classes=4).to(device)

# # Load the state dict manually by ignoring the mismatched layers (classifier layers)
# pretrained_dict = torch.load(os.path.join(settings.BASE_DIR, "mobilenet_irrelevent.pt"), map_location=device)

# # Get the model's state_dict (current model)
# model_dict = common_mobilenet.state_dict()  

# # Filter out the classifier layers that are mismatched (we don't need them in this case)
# pretrained_dict = {k: v for k, v in pretrained_dict.items() if k in model_dict and model_dict[k].size() == v.size()}

# # Update the model's state_dict with the filtered weights
# model_dict.update(pretrained_dict)
# common_mobilenet.load_state_dict(model_dict)

# common_mobilenet.eval()

# # Load other models for brain, kidney, and lung classification
# brain_densenet = DenseNetModel(num_classes=4).to(device)
# brain_densenet.load_state_dict(torch.load(os.path.join(settings.BASE_DIR, "densenet.pt"), map_location=device))
# brain_densenet.eval()

# brain_class_names = ['glioma', 'notumor', 'pituitary', 'meningioma']

# kidney_densenet = DenseNetModel(num_classes=4).to(device)
# kidney_densenet.load_state_dict(torch.load(os.path.join(settings.BASE_DIR, "densenetkidney.pt"), map_location=device))
# kidney_densenet.eval()

# kidney_class_names = ['Cyst', 'Normal', 'Stone', 'Tumor']

# lung_densenet = DenseNetModel(num_classes=5).to(device)
# lung_densenet.load_state_dict(torch.load(os.path.join(settings.BASE_DIR, "densenet_lung.pt"), map_location=device))
# lung_densenet.eval()

# lung_class_names = ['Bacterial Pneumonia', 'Corona Virus Disease', 'Viral Pneumonia', 'Tuberculosis', 'Normal']

# # Image Transformation
# image_transform = transforms.Compose([
#     transforms.Resize((224, 224)),
#     transforms.ToTensor(),
#     transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
# ])

# def predict_category(image, model):
#     image = image_transform(image).unsqueeze(0).to(device)
#     with torch.no_grad():
#         output = model(image)
#         _, predicted = torch.max(output, 1)
#     label_mapping = {0: "Brain", 1: "Lung",2:"Irrelevent",3:"Kidney"}
#     predicted_label = label_mapping.get(predicted.item(), "Unknown")
    
#     return predicted_label

# def predict_classification(image, model, class_names):
#     image = image_transform(image).unsqueeze(0).to(device)
#     with torch.no_grad():
#         output = model(image)
#         predicted_class = output.argmax(dim=1).item()
#     return class_names[predicted_class]

# class GradCAM:
#     def __init__(self, model, target_layer):
#         self.model = model
#         self.target_layer = target_layer
#         self.feature_maps = None
#         self.target_layer.register_forward_hook(self.forward_hook)

#     def forward_hook(self, module, input, output):
#         self.feature_maps = output

#     def generate_cam(self, input_tensor, class_idx):
#         output = self.model(input_tensor)
#         self.model.zero_grad()
#         one_hot = torch.zeros((1, output.size(-1))).to(input_tensor.device)
#         one_hot[0, class_idx] = 1
#         output.backward(gradient=one_hot, retain_graph=True)
#         gradients = torch.autograd.grad(outputs=output[:, class_idx], inputs=self.feature_maps, grad_outputs=torch.ones_like(output[:, class_idx]), retain_graph=True)[0]
#         weights = gradients.mean(dim=(2, 3), keepdim=True)
#         cam = (weights * self.feature_maps).sum(dim=1).squeeze(0).cpu().detach().numpy()
#         cam = (cam - cam.min()) / (cam.max() - cam.min())
#         return cv2.resize(cam, (224, 224))

# # Image Upload and Processing View
# class ImageUploadView(APIView):
#     permission_classes=[IsAuthenticated]
#     def post(self, request, *args, **kwargs):
#         print(self.permission_classes)
#         print(request.data)

#         serializer = ImageUploadSerializer(data=request.data)
    
#         if serializer.is_valid():
#             image_file = serializer.validated_data['image']
#             category = serializer.validated_data['category']
            

#             # Save the uploaded image
#             uploaded_image = UploadedImage.objects.create(image=image_file, category=category)

#             # Open the image
#             image = Image.open(uploaded_image.image.path).convert('RGB')

#             # Select models based on category
#             if category == "brain":
#                 classification_model = brain_densenet
#                 class_names = brain_class_names
#             elif category == "kidney":
#                 classification_model = kidney_densenet
#                 class_names = kidney_class_names
#             elif category == "lung":
#                 classification_model = lung_densenet
#                 class_names = lung_class_names
#             else:
#                 return Response({"error": "Invalid category. Choose 'brain', 'kidney', or 'lung'."}, status=400)

#             # Use the common MobileNet model for relevance detection
#             relevance_model = common_mobilenet

#             # Check relevance
#             relevance = predict_category(image, relevance_model)
#             if relevance == "irrelevant":
#                 return Response({"message": "The image is irrelevant."})

#             # Predict Class
#             predicted_class = predict_classification(image, classification_model, class_names)

#             # Generate Grad-CAM
#             input_tensor = image_transform(image).unsqueeze(0).to(device)
#             target_layer = classification_model.densenet.features[-1]
#             grad_cam = GradCAM(classification_model, target_layer)
#             cam = grad_cam.generate_cam(input_tensor, class_names.index(predicted_class))
#             heatmap = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)

#             # Save Grad-CAM Image
#             grad_cam_image_path = os.path.join(settings.MEDIA_ROOT, "gradcam.jpg")
#             cv2.imwrite(grad_cam_image_path, heatmap)

#             return Response({
#                 "message": "Image processed successfully",
#                 "category": category,
#                 "uploaded_image_url": request.build_absolute_uri(uploaded_image.image.url),
#                 "predicted_class": predicted_class,
#                 "gradcam_image": request.build_absolute_uri(settings.MEDIA_URL + "gradcam.jpg"),
#             })

#         return Response(serializer.errors, status=400)

class EditreportView(APIView):
    permission_classes=[AllowAny]

    def post(self,request):
        print(self.permission_classes)

        data=request.data.copy()
        data['user']=request.user.id
        print(data)


        serializer=EditreportSerializer(data=data,context={'request':request})
        if serializer.is_valid():
            serializer.save()
            return Response({"res":'Report Saved Successfully',
                             'data':serializer.data},
                             status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class ViewReportView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        user=request.user
        try:
            data=EditReport.objects.filter(user=user).order_by('-created_at').first()
            if data:
                serializer=EditreportSerializer(data)
                return Response({"res":"Data Fetched Successfully",
                                 "data":serializer.data},status=status.HTTP_200_OK)
            else:
                return Response({"res":"Data Not Found"},status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"res":"something Went wrong "},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DoctorView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request,category):
        print('category is ',category)
        doctor=Doctor.objects.filter(category=category)
        if not doctor.exists():
            return Response({"error":"Doctor Not found"},status=status.HTTP_404_NOT_FOUND)

        if doctor.exists():
            random=choice(doctor)
            serializer=DoctorSerializer(random)
            if serializer:
                return Response({"res":"Doctor Fetched Successfully",
                                 'data':serializer.data},
                                 status=status.HTTP_200_OK)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
class UpdateUserView(APIView):
    permission_classes=[IsAuthenticated]
    def put(self,request):
        serializer=UserDetailsSerializer(request.user,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"res":"Profile Updated Successfully",
                             "data":serializer.data},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class ViewUserView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user.id
        data=Customuser.objects.get(id=user)
        serializer=ViewuserSerializer(data,context={"request":request})
        if serializer:
            return Response({"res":'Data Fetched Successfully',
                             'data':serializer.data},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class ViewDetailreportView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,category):
        report=Report.objects.filter(category=category)
        print(category)
        if report.exists():
            random=choice(report)
        serializer=ReportSerializer(random)
        if serializer:
            return Response({"res":"DetailReport Fetched Successfully",
                             "data":serializer.data},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class HistoryView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        request.data['user']=request.user.id
        serializer=HistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"res":"History saved Successfully"},
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class ViewHistoryView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user.id
        print('user',user)
        data=history.objects.filter(user=user)
        serializer=HistorySerializer(data,many=True)
        if serializer:
            return Response({"res":"Data Fetched Successfully",
                             'data':serializer.data},status=status.HTTP_200_OK)
        return Response({"res":"Not Found"},status=status.HTTP_404_NOT_FOUND)





import torch
import torch.nn as nn
import torchvision
from torchvision import transforms, models
from PIL import Image
import numpy as np
import cv2
import os
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import models

from .serailizers import *
from django.core.files.storage import default_storage

# Device Configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Define MobileNet Model (Relevance Detection)
class MobileNetModel(nn.Module):
    def __init__(self, num_classes):
        super(MobileNetModel, self).__init__()
        self.mobilenet = torchvision.models.mobilenet_v2(pretrained=True)
        num_features = self.mobilenet.classifier[1].in_features
        self.mobilenet.classifier[1] = nn.Linear(num_features, num_classes)

    def forward(self, x):
        return self.mobilenet(x)

# Define DenseNet Model (Classification)
class DenseNetModel(nn.Module):
    def __init__(self, num_classes):
        super(DenseNetModel, self).__init__()
        self.densenet = torchvision.models.densenet121(pretrained=False)
        num_features = self.densenet.classifier.in_features
        self.densenet.classifier = nn.Linear(num_features, num_classes)

    def forward(self, x):
        return self.densenet(x)

# Load Models for Classification
common_mobilenet = MobileNetModel(num_classes=4).to(device)
common_mobilenet.load_state_dict(torch.load("mobilenet_irrelevent.pt", map_location=device))
common_mobilenet.eval()

brain_densenet = DenseNetModel(num_classes=4).to(device)
brain_densenet.load_state_dict(torch.load("brain_densenet.pt", map_location=device))
brain_densenet.eval()

brain_class_names = ['glioma', 'notumor', 'pituitary', 'meningioma']

kidney_densenet = DenseNetModel(num_classes=4).to(device)
kidney_densenet.load_state_dict(torch.load("densenetkidney.pt", map_location=device))
kidney_densenet.eval()

kidney_class_names = ['Cyst', 'Normal', 'Stone', 'Tumor']

lung_densenet = DenseNetModel(num_classes=5).to(device)
lung_densenet.load_state_dict(torch.load("densenet_lung.pt", map_location=device))
lung_densenet.eval()

lung_class_names = ['Bacterial Pneumonia', 'Corona Virus Disease', 'Viral Pneumonia', 'Tuberculosis', 'Normal']

# Image Transformation
image_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def predict_category(image, model):
    image = image_transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(image)
        _, predicted = torch.max(output, 1)
    # label_mapping = {0: "irrelevant", 1: "Kidney", 2: "Brain", 3: "Lung"}
    label_mapping = {0: "brain", 1: "lung", 2: "irrelevant", 3: "kidney"}
    print(11111111,label_mapping)
    predicted_label = label_mapping.get(predicted.item(), "Unknown")
    
    return predicted_label

def predict_classification(image, model, class_names):
    image = image_transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(image)
        predicted_class = output.argmax(dim=1).item()
    return class_names[predicted_class]

class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.feature_maps = None
        self.target_layer.register_forward_hook(self.forward_hook)

    def forward_hook(self, module, input, output):
        self.feature_maps = output

    def generate_cam(self, input_tensor, class_idx):
        output = self.model(input_tensor)
        self.model.zero_grad()
        one_hot = torch.zeros((1, output.size(-1))).to(input_tensor.device)
        one_hot[0, class_idx] = 1
        output.backward(gradient=one_hot, retain_graph=True)
        gradients = torch.autograd.grad(outputs=output[:, class_idx], inputs=self.feature_maps, grad_outputs=torch.ones_like(output[:, class_idx]), retain_graph=True)[0]
        weights = gradients.mean(dim=(2, 3), keepdim=True)
        cam = (weights * self.feature_maps).sum(dim=1).squeeze(0).cpu().detach().numpy()
        cam = (cam - cam.min()) / (cam.max() - cam.min())
        return cv2.resize(cam, (224, 224))

# Image Upload and Processing View
class ImageUploadView(APIView):
    permission_classes=[AllowAny]

    def post(self, request, *args, **kwargs):
        # request.data['category']='lung'
        
        serializer = ImageUploadSerializer(data=request.data)
        if serializer.is_valid():
            image_file = serializer.validated_data['image']
            # category = serializer.validated_data['category']

            # Save the uploaded image
            uploaded_image = UploadedImage.objects.create(image=image_file)

            # Open the image
            image = Image.open(uploaded_image.image.path).convert('RGB')

            # Select models based on category
            
            # Use the common MobileNet model for relevance detection
            relevance_model = common_mobilenet

            # Check relevance
            relevance = predict_category(image, relevance_model)
            print(f"Relevance: {relevance}")
            if relevance == "irrelevant":
                return Response({"message": "The image is irrelevant."})

            if relevance == "brain":
                classification_model = brain_densenet
                class_names = brain_class_names
            elif relevance == "kidney":
                classification_model = kidney_densenet
                class_names = kidney_class_names
            elif relevance == "lung":
                classification_model = lung_densenet
                class_names = lung_class_names
            else:
                return Response({"error": "Invalid category. Choose 'brain', 'kidney', or 'lung'."}, status=400)

                # Predict Class
            predicted_class = predict_classification(image, classification_model, class_names)
            print(f"Predicted Class: {predicted_class}")       
            # predicted_class = predict_classification(image, classification_model, class_names)

            # Generate Grad-CAM
            input_tensor = image_transform(image).unsqueeze(0).to(device)
            target_layer = classification_model.densenet.features[-1]
            grad_cam = GradCAM(classification_model, target_layer)
            cam = grad_cam.generate_cam(input_tensor, class_names.index(predicted_class))
            heatmap = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
            # Save Grad-CAM Image
            grad_cam_image_path = os.path.join(settings.MEDIA_ROOT, "gradcam.jpg")
            cv2.imwrite(grad_cam_image_path, heatmap)

            return Response({
                "message": "Image processed successfully",
                "uploaded_image_url": request.build_absolute_uri(uploaded_image.image.url),
                "predicted_class": predicted_class,
                "gradcam_image": request.build_absolute_uri(settings.MEDIA_URL + "gradcam.jpg"),
                "cat":relevance
            })

        return Response(serializer.errors, status=400)





