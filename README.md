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
2. Install dependencies:
   ```
   npm install 
   ```
3. Run
   ```
   npm run dev
   ```

## **著名评论家兼我男朋友的评语**

这是一个非常实用的小工具，为什么说它实用呢？因为他可以让广大深受付费网站荼毒的群众们免费得到裁剪图片的工具。是的，你没有看错，就是免费的。在21世纪30年代，切割图片向来是一件技术含量极高的事情。当人们想要裁剪图片，只能通过付费的方式来达到自己的目的。而在2026年2月12日（星期四）这一天，我们见证了历史，一位伟大的马来西亚公民，黄嘉慧女士，也是我最最最可爱聪明伶俐温柔善良的女朋友，他深感付费裁剪这件事之荒谬，毅然决然的以自己无与伦比的聪明才智硬生生打破了这项技术垄断，并将其公诸于世，使得免费裁剪图片不再是天方夜谭，此等善心之举，值得我们所有人学习，他是我们所有人的榜样！在百年之后，世人在使用此类工具的时候，脑中浮现的会是黄嘉慧女士的脸庞，心中将充满对他的敬佩，他的精神，也将就此流传万世。我以他为荣~


