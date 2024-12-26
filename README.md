# Translation Comparison Tool

This project is a web-based tool designed to compare translations from multiple APIs, including **Google Translate**, **MyMemory**, and **OpenAI's GPT models**. It allows users to translate text, compare results, and analyze the quality of translations through either OpenAI's GPT or a custom fallback evaluation function. 

---

## Features

### 🌐 Multi-API Translation:
- **Google Translate API** for high-speed translations.
- **MyMemory API** for community-based translation support.
- **OpenAI GPT Integration** for detailed analysis and ranking of translations.

### 🛠 Custom Evaluation:
- A **fallback evaluation function** that:
  - Analyzes semantic similarity.
  - Compares text length differences.
  - Evaluates punctuation correctness.
  - Determines the better translation based on metrics.

### 🖥 User-Friendly Interface:
- Simple input fields for source text, source language, and target language selection.
- API key management for OpenAI's GPT integration.
- Responsive design with real-time API responses.

---

## Installation and Setup

1. **Clone the Repository**:  
   ```bash
   git clone https://github.com/your-username/translation-comparison-tool.git
   cd translation-comparison-tool
   ```

2. **Host the Application**:  
   Open the `index.html` file in any modern web browser.

3. **Set API Keys**:  
   - Obtain API keys for OpenAI, Google Translate, and MyMemory.
   - Enter the OpenAI API key directly in the app interface.

---

## Usage

1. Enter the text you want to translate in the input box.  
2. Select the source and target languages from the dropdown menus.  
3. Click **"Translate and Compare"** to:
   - Fetch translations from Google Translate and MyMemory.
   - Compare and rank them using OpenAI or the fallback evaluation function.  
4. View detailed API responses and comparison results in the output panel.

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript (jQuery)  
- **APIs Integrated**:
  - Google Translate API
  - MyMemory API
  - OpenAI GPT API

---

## Screenshots

**1. Input and Language Selection:**  
![Input Screen](path-to-screenshot)

**2. Translation Comparison:**  
![Comparison Results](path-to-screenshot)

---

## Contributions

- **API Integration and Error Handling**: Naveen Singh  
- **Frontend Development and Fallback Logic**: Sanidhya Shrivastava  

---

## Notes

- The tool requires an active OpenAI API key for detailed translation comparisons.
- Fallback functionality ensures reliable operation even if OpenAI services are unavailable.

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

## Acknowledgments

- **Google Translate** for accurate and quick translations.
- **MyMemory** for providing a rich translation database.
- **OpenAI GPT** for advanced language processing capabilities.