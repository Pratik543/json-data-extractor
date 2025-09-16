# JSON Data Extractor - Web Application

## **Overview**
A modern, responsive web application for parsing, visualizing, and extracting data from JSON files with an intuitive glassmorphism UI and advanced features.

## **Core Features**

### **📥 Data Input**
- **Manual Input**: Large textarea with syntax highlighting for pasting JSON
- **File Upload**: Drag & drop or click-to-browse JSON file upload with validation
- **Sample Data**: Pre-loaded sample JSON for testing and demonstration

### **🔍 Search & Extract**
- **Search by Key**: Find all occurrences of a specific key throughout the JSON structure
- **Path Extraction**: Extract values using dot notation paths (e.g., `user.address.city`)
- **Real-time Results**: Instant display of search results with full paths

### **🌳 Tree Explorer**
- **Hierarchical View**: Interactive tree structure with expand/collapse functionality
- **Smart Numbering**: Sequential numbering system (1, 2, 3...) that resets for each parent object
- **Item Counting**: Shows total items in each nested object/array
- **Visual Indicators**: Different styling for objects, arrays, strings, numbers, and booleans

### **🎨 User Experience**
- **Dual Themes**: Dark mode (default) with radial dot pattern / Light mode toggle
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Glassmorphism UI**: Modern glass-effect panels with backdrop blur
- **Smooth Animations**: Micro-interactions and transitions throughout

### **⚡ Utility Functions**
- **JSON Formatting**: Auto-format and beautify malformed JSON
- **Copy to Clipboard**: One-click copy for individual values or entire results
- **Data Validation**: Real-time JSON syntax validation with error messages
- **File Statistics**: Display item counts and file information

### **🔧 Technical Features**
- **Progressive Web App**: Vite-based vanilla JavaScript architecture
- **Memory Efficient**: Handles large JSON files without performance issues
- **Toast Notifications**: Non-intrusive success/error feedback system
- **Keyboard Shortcuts**: Enter key support for search inputs

## **Use Cases**
- **API Response Analysis**: Inspect and debug REST API responses
- **Data Migration**: Extract specific fields from large JSON datasets  
- **Configuration Management**: Navigate complex configuration files
- **Learning Tool**: Understand JSON structure and hierarchy
- **Development Workflow**: Quick JSON formatting and validation

## **Tech Stack**
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **Icons**: Feather Icons for consistent UI elements
- **Responsive**: Mobile-first design with breakpoint optimization

This application serves as a comprehensive JSON manipulation tool that combines functionality with modern design principles, making JSON data analysis accessible and efficient for developers, data analysts, and anyone working with structured data.
