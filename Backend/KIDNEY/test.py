import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import numpy as np
import cv2
import matplotlib.pyplot as plt

# Device configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Define the MobileNet model for relevance detection
class MobileNetModel(nn.Module):
    def __init__(self, num_classes):
        super(MobileNetModel, self).__init__()
        self.mobilenet = models.mobilenet_v2(pretrained=True)
        num_features = self.mobilenet.classifier[1].in_features
        self.mobilenet.classifier[1] = nn.Linear(num_features, num_classes)

    def forward(self, x):
        return self.mobilenet(x)

# Define the DenseNet model
class DenseNetModel(nn.Module):
    def __init__(self, num_classes):
        super(DenseNetModel, self).__init__()
        self.densenet = models.densenet121(pretrained=False)
        num_features = self.densenet.classifier.in_features
        self.densenet.classifier = nn.Linear(num_features, num_classes)

    def forward(self, x):
        return self.densenet(x)

# Load MobileNet and DenseNet models
mobilenet_model = MobileNetModel(num_classes=2).to(device)
mobilenet_model.load_state_dict(torch.load("mobilenet_irrelevent_kidney.pt"))
mobilenet_model.eval()

densenet_model = DenseNetModel(num_classes=4).to(device)
densenet_model.load_state_dict(torch.load("densenetkidney.pt", map_location=device))
densenet_model.eval()

# Class names for DenseNet model
densenet_class_names = ['Cyst', 'Normal', 'Stone', 'Tumor']  

# Image transformation
image_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Helper function to map MobileNet prediction to label
def map_mobilenet_prediction(prediction):
    label_mapping = {0: "irrelevant", 1: "relevant"}
    return label_mapping.get(prediction, "Unknown")

# Function to predict using the MobileNet model
def predict_mobilenet(image_path):
    image = Image.open(image_path).convert('RGB')
    image = image_transform(image).unsqueeze(0).to(device)
    
    with torch.no_grad():
        output = mobilenet_model(image)
        _, predicted = torch.max(output, 1)
        
    return predicted.item()

# Grad-CAM implementation for DenseNet model
class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.feature_maps = None

        # Hook to capture feature maps
        self.target_layer.register_forward_hook(self.forward_hook)

    def forward_hook(self, module, input, output):
        self.feature_maps = output

    def generate_cam(self, input_tensor, class_idx):
        # Forward pass
        output = self.model(input_tensor)

        # Backward pass for the selected class
        self.model.zero_grad()
        one_hot = torch.zeros((1, output.size(-1)), dtype=torch.float32).to(input_tensor.device)
        one_hot[0, class_idx] = 1
        output.backward(gradient=one_hot, retain_graph=True)

        # Calculate gradients manually
        gradients = torch.autograd.grad(outputs=output[:, class_idx],
                                         inputs=self.feature_maps,
                                         grad_outputs=torch.ones_like(output[:, class_idx]),
                                         retain_graph=True)[0]

        # Compute the Grad-CAM
        weights = gradients.mean(dim=(2, 3), keepdim=True)
        cam = (weights * self.feature_maps).sum(dim=1).squeeze(0)

        # Normalize and resize CAM
        cam = torch.relu(cam).detach().cpu().numpy()
        cam = (cam - cam.min()) / (cam.max() - cam.min())
        cam = cv2.resize(cam, (input_tensor.size(-1), input_tensor.size(-2)))

        return cam

# Load image and predict using the MobileNet model
def load_image(image_path):
    image = Image.open(image_path).convert("RGB")
    input_tensor = image_transform(image).unsqueeze(0).to(device)
    return input_tensor, image

# Main function to process the image
def process_image(image_path):
    # Predict relevance using MobileNet
    prediction = predict_mobilenet(image_path)
    predicted_label = map_mobilenet_prediction(prediction)

    if predicted_label == "irrelevant":
        print("The image is irrelevant. No further processing.")
        return

    print(f"The image is relevant. Proceeding with DenseNet classification.")

    # Process image with DenseNet model if relevant
    input_tensor, original_image = load_image(image_path)

    # Predict the class using DenseNet
    output = densenet_model(input_tensor)
    predicted_class = output.argmax(dim=1).item()
    predicted_class_name = densenet_class_names[predicted_class]
    print(f"Predicted Class: {predicted_class_name}")

    # Grad-CAM visualization for DenseNet
    target_layer = densenet_model.densenet.features[-1]  # Final convolutional layer
    grad_cam = GradCAM(densenet_model, target_layer)
    cam = grad_cam.generate_cam(input_tensor, predicted_class)

    # Convert input tensor to numpy image
    input_image = input_tensor.squeeze(0).permute(1, 2, 0).cpu().numpy()
    input_image = (input_image - input_image.min()) / (input_image.max() - input_image.min())
    input_image = np.uint8(255 * input_image)

    # Overlay Grad-CAM heatmap
    heatmap = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
    overlay = cv2.addWeighted(input_image, 0.5, heatmap, 0.5, 0)

    # Display the results
    plt.figure(figsize=(10, 5))
    plt.subplot(1, 3, 1)
    plt.imshow(original_image)
    plt.title(f"Original Image (Predicted: {predicted_class_name})")
    plt.axis("off")

    plt.subplot(1, 3, 2)
    plt.imshow(cam, cmap="jet")
    plt.title("Grad-CAM Heatmap")
    plt.axis("off")

    plt.subplot(1, 3, 3)
    plt.imshow(overlay)
    plt.title("Overlay")
    plt.axis("off")

    plt.show()

# Example image path (update with your image file)
image_path = r"relevent and irrelevent\relevent\Cyst- (13).jpg"
process_image(image_path)
