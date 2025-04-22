// DOM Elements
const htmlInput = document.querySelector(".html-editor textarea");
const cssInput = document.querySelector(".css-editor textarea");
const jsInput = document.querySelector(".js-editor textarea");
const saveBtn = document.querySelector("#save");
const output = document.querySelector("#output");
const outputContainer = document.querySelector(".output-container");
const fullBtn = document.querySelector("#full");
const copyBtns = document.querySelectorAll(".copy");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector("#theme-icon");
const notification = document.querySelector("#notification");
const notificationMessage = document.querySelector("#notification-message");

// Initialize editor with some default content
const defaultHTML = `<!DOCTYPE html>
<html>
<head>
  <title>My Web Page</title>
</head>
<body>
  <h1>Welcome to NeoCode Editor!</h1>
  <p>Start coding to see your results here.</p>
  <button id="demo-btn">Click Me</button>
</body>
</html>`;

const defaultCSS = `body {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  margin: 0;
  padding: 20px;
  text-align: center;
}

h1 {
  color: #6f42c1;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

button {
  background: linear-gradient(135deg, #6f42c1, #01c2cb);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}`;

const defaultJS = `document.getElementById('demo-btn').addEventListener('click', function() {
  alert('Hello from NeoCode Editor!');
});`;

// Set default values
htmlInput.value = defaultHTML;
cssInput.value = defaultCSS;
jsInput.value = defaultJS;

// Load initial content
window.addEventListener('DOMContentLoaded', () => {
  updateOutput();
});

// Update output when run button is clicked
saveBtn.addEventListener("click", updateOutput);

// Function to update the output
function updateOutput() {
  // Add animation to run button
  saveBtn.classList.add('clicked');
  setTimeout(() => {
    saveBtn.classList.remove('clicked');
  }, 200);
  
  // Update the iframe content
  output.contentDocument.body.innerHTML = htmlInput.value;
  output.contentDocument.head.innerHTML = `<style>${cssInput.value}</style>`;
  
  // Execute JavaScript with error handling
  try {
    output.contentWindow.eval(jsInput.value);
  } catch (error) {
    console.error("JavaScript Error:", error);
    // Optionally display error in the output
    const errorDiv = document.createElement('div');
    errorDiv.style.color = 'red';
    errorDiv.style.padding = '10px';
    errorDiv.style.fontFamily = 'monospace';
    errorDiv.textContent = `JavaScript Error: ${error.message}`;
    output.contentDocument.body.appendChild(errorDiv);
  }
}

// Toggle full screen for output
fullBtn.addEventListener("click", () => {
  outputContainer.classList.toggle("output-full-active");
  
  if (outputContainer.classList.contains("output-full-active")) {
    fullBtn.style.transform = "rotate(180deg)";
    fullBtn.classList.remove("fa-expand");
    fullBtn.classList.add("fa-compress");
  } else {
    fullBtn.style.transform = "rotate(0deg)";
    fullBtn.classList.remove("fa-compress");
    fullBtn.classList.add("fa-expand");
  }
});

// Copy functionality
copyBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    let textToCopy = "";
    let copyMessage = "";
    
    if (btn.classList.contains("copy1")) {
      textToCopy = htmlInput.value;
      copyMessage = "HTML copied to clipboard!";
    } else if (btn.classList.contains("copy2")) {
      textToCopy = cssInput.value;
      copyMessage = "CSS copied to clipboard!";
    } else {
      textToCopy = jsInput.value;
      copyMessage = "JavaScript copied to clipboard!";
    }
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        showNotification(copyMessage);
        // Add visual feedback
        btn.classList.add("fa-check");
        btn.classList.remove("fa-copy");
        
        setTimeout(() => {
          btn.classList.remove("fa-check");
          btn.classList.add("fa-copy");
        }, 1500);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        showNotification("Failed to copy text");
      });
  });
});

// Theme toggle functionality
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  
  if (document.body.classList.contains("light-theme")) {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }
});

// Show notification
function showNotification(message) {
  notificationMessage.textContent = message;
  notification.classList.add("show");
  
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

// Textarea auto resize based on content
const textareas = document.querySelectorAll('textarea');
textareas.forEach(textarea => {
  textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });
});

// Handle tab key in textareas
document.querySelectorAll('textarea').forEach(textarea => {
  textarea.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      // Insert tab at cursor position
      const start = this.selectionStart;
      const end = this.selectionEnd;
      
      this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 2;
    }
  });
});

// Autosave functionality
let autosaveTimer;
const autosave = () => {
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    localStorage.setItem('neocode_html', htmlInput.value);
    localStorage.setItem('neocode_css', cssInput.value);
    localStorage.setItem('neocode_js', jsInput.value);
  }, 1000);
};

// Load saved content from localStorage
const loadSavedContent = () => {
  const savedHtml = localStorage.getItem('neocode_html');
  const savedCss = localStorage.getItem('neocode_css');
  const savedJs = localStorage.getItem('neocode_js');
  
  if (savedHtml) htmlInput.value = savedHtml;
  if (savedCss) cssInput.value = savedCss;
  if (savedJs) jsInput.value = savedJs;
};

// Add autosave event listeners
htmlInput.addEventListener('input', autosave);
cssInput.addEventListener('input', autosave);
jsInput.addEventListener('input', autosave);

// Load saved content if available
loadSavedContent();

// Initial render
updateOutput();