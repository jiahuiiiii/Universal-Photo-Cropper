# **Universal Photo Cropper**

A precision-engineered React & TypeScript tool designed to crop and validate official ID photographs (Passports, Visas, etc.) according to strict international specifications.

## **🚀 Overview**

Official identification documents often require highly specific "chin-to-crown" ratios and pixel dimensions. This tool simplifies that process by providing a real-time canvas interface with adjustable mathematical guides, ensuring your photo meets technical requirements for agencies like ICA (Singapore), the US State Department, and EU authorities.

## **✨ Key Features**

* **Custom Precision**: Fully adjustable width and height in pixels.  
* **Dynamic Face Guides**: Moveable "Crown" and "Chin" markers to hit exact percentage-based height requirements (e.g., 25mm-35mm head size).  
* **Official Presets**: One-click configuration for:  
  * **Singapore Passport** (354x472px)  
  * **US Visa** (600x600px)  
  * **EU Standard** (35x45mm equivalent)  
* **Advanced Mobile Interaction**:  
  * **Single Finger**: Standard page scrolling.  
  * **Two-Finger Pan**: Move the photo within the frame.  
  * **Pinch-to-Zoom**: Intuitive scaling using two-finger gestures.  
* **High-Quality Export**: Downloads the result as a sharp PNG at the exact target resolution.

## **🛠️ Tech Stack**

* **React 18**  
* **TypeScript** (Strict Type Safety)  
* **Tailwind CSS** (Responsive UI)  
* **Lucide React** (Iconography)  
* **HTML5 Canvas API** (Image Processing)

## **📖 Usage**

1. **Upload**: Select your photograph using the "Upload New Image" button.  
2. **Configure**: Choose a preset or enter your required pixel dimensions.  
3. **Align**:  
   * Use the **Crown Slider** to mark the top of the head.  
   * Use the **Chin Slider** to mark the bottom of the chin.  
   * Drag and Zoom the photo so the head fits perfectly between these lines.  
4. **Download**: Hit "Download Result" to save your compliant photo.

## **🔧 Installation (Local Development)**

If you'd like to run this component in your own project:

1. Clone the repository:
   ```
   git clone https://github.com/jiahuiiiii/Universal-Photo-Cropper
   ```
3. Install dependencies:
   ```
   npm install lucide-react
   ```
5. Copy PhotoCropper.tsx into your components folder.

