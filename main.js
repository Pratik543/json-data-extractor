import "./style.css";

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Feather Icons
  feather.replace();

  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const body = document.body;
  let isDarkMode = true;

  themeToggle.addEventListener("click", function () {
    isDarkMode = !isDarkMode;

    if (isDarkMode) {
      body.classList.remove("light-mode");
      body.className =
        "min-h-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] text-white transition-colors duration-300";
      themeIcon.setAttribute("data-feather", "moon");
    } else {
      body.classList.add("light-mode");
      body.className =
        "min-h-screen light-mode bg-[#ffffff] bg-[radial-gradient(#00000033_1px,#f0f9ff_1px)] bg-[size:20px_20px] text-gray-900 transition-colors duration-300";
      themeIcon.setAttribute("data-feather", "sun");
    }
    feather.replace();
  });

  // JSON input elements
  const jsonInput = document.getElementById("json-input");
  const extractJsonBtn = document.getElementById("extract-json-btn");
  const formatBtn = document.getElementById("format-btn");
  const clearBtn = document.getElementById("clear-btn");
  const searchKey = document.getElementById("search-key");
  const searchBtn = document.getElementById("search-btn");
  const pathInput = document.getElementById("path-input");
  const valueByPathExtractBtn = document.getElementById("extract-btn");
  const resultsContainer = document.getElementById("results-container");
  const treeResult = document.getElementById("tree-result");
  const copyBtn = document.getElementById("copy-btn");
  const sampleBtn = document.getElementById("sample-btn");

  // Sample JSON data
  const sampleJson = `{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "isActive": true,
    "address": {
        "street": "123 Main St",
        "city": "New York",
        "zip": "10001"
    },
    "skills": [
        "JavaScript",
        "HTML",
        "CSS"
    ],
    "projects": [
        {
            "name": "Website Redesign",
            "completed": true
        },
        {
            "name": "Mobile App",
            "completed": false
        }
    ],
    "colleagues": [
        {
            "id": 1,
            "first_name": "Collin",
            "last_name": "MacGinley",
            "email": "cmacginley0@google.de",
            "gender": "Male",
            "ip_address": "168.80.119.163"
        },
        {
            "id": 2,
            "first_name": "Neely",
            "last_name": "O'Corren",
            "email": "nocorren1@youtu.be",
            "gender": "Polygender",
            "ip_address": "224.188.178.218"
        }
    ]
}`;

  // Button animations
  function addButtonAnimation(button) {
    button.addEventListener("mousedown", () =>
      button.classList.add("animate-press"),
    );
    button.addEventListener("mouseup", () =>
      button.classList.remove("animate-press"),
    );
    button.addEventListener("mouseleave", () =>
      button.classList.remove("animate-press"),
    );
  }

  [
    sampleBtn,
    formatBtn,
    extractJsonBtn,
    clearBtn,
    searchBtn,
    valueByPathExtractBtn,
    copyBtn,
  ].forEach(addButtonAnimation);

  // Load sample JSON
  sampleBtn.addEventListener("click", function () {
    jsonInput.value = sampleJson;
    showNotification("Sample JSON loaded!", "success");
  });

  // File upload functionality
  const jsonFileInput = document.getElementById("json-file-input");
  const fileInfo = document.getElementById("file-info");
  const fileName = document.getElementById("file-name");
  const fileSize = document.getElementById("file-size");
  const fileStats = document.getElementById("file-stats");
  const removeFileBtn = document.getElementById("remove-file");
  const fileDropZone =
    jsonFileInput.parentElement.querySelector(".file-drop-zone");

  // File upload event listeners
  jsonFileInput.addEventListener("change", handleFileUpload);
  removeFileBtn.addEventListener("click", removeFile);

  // Drag and drop functionality
  fileDropZone.addEventListener("dragover", handleDragOver);
  fileDropZone.addEventListener("dragleave", handleDragLeave);
  fileDropZone.addEventListener("drop", handleFileDrop);

  function handleDragOver(e) {
    e.preventDefault();
    fileDropZone.classList.add("drag-over");
  }

  function handleDragLeave(e) {
    e.preventDefault();
    fileDropZone.classList.remove("drag-over");
  }

  function handleFileDrop(e) {
    e.preventDefault();
    fileDropZone.classList.remove("drag-over");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "application/json" || file.name.endsWith(".json")) {
        jsonFileInput.files = files;
        handleFileUpload({ target: { files: [file] } });
      } else {
        showNotification("Please select a valid JSON file!", "error");
      }
    }
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      showNotification("Please select a valid JSON file!", "error");
      return;
    }

    // Show file info
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileInfo.classList.remove("hidden");
    fileDropZone.classList.add("file-upload-success");

    // Read file content
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const jsonContent = e.target.result;
        JSON.parse(jsonContent); // Validate JSON
        jsonInput.value = jsonContent;

        // Update stats
        const itemCount = countJsonItems(JSON.parse(jsonContent));
        fileStats.textContent = `${itemCount.total} items loaded`;

        showNotification(
          `JSON file loaded successfully! (${itemCount.total} items)`,
          "success",
        );
        feather.replace();
      } catch (error) {
        showNotification(`Invalid JSON file: ${error.message}`, "error");
        removeFile();
      }
    };

    reader.onerror = function () {
      showNotification("Error reading file!", "error");
      removeFile();
    };

    reader.readAsText(file);
  }

  function removeFile() {
    jsonFileInput.value = "";
    fileInfo.classList.add("hidden");
    fileDropZone.classList.remove("file-upload-success");
    fileStats.textContent = "No file selected";
    showNotification("File removed", "success");
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  function countJsonItems(obj, depth = 0) {
    let total = 0;
    let nested = 0;

    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        total += obj.length;
        obj.forEach((item) => {
          if (typeof item === "object" && item !== null) {
            const subCount = countJsonItems(item, depth + 1);
            total += subCount.total;
            nested += subCount.nested + 1;
          }
        });
      } else {
        const keys = Object.keys(obj);
        total += keys.length;
        keys.forEach((key) => {
          const value = obj[key];
          if (typeof value === "object" && value !== null) {
            const subCount = countJsonItems(value, depth + 1);
            total += subCount.total;
            nested += subCount.nested + 1;
          }
        });
      }
    }

    return { total, nested };
  }

  // Format JSON
  formatBtn.addEventListener("click", function () {
    try {
      const json = JSON.parse(jsonInput.value);
      jsonInput.value = JSON.stringify(json, null, 2);
      showNotification("JSON formatted successfully!", "success");
    } catch (e) {
      resultsContainer.innerHTML = `<div class="text-error p-4 text-center">
                        <i data-feather="alert-circle" class="w-8 h-8 mx-auto mb-2"></i>
                        <p>Invalid JSON: ${e.message}</p>
                    </div>`;
      feather.replace();
      showNotification("Invalid JSON format!", "error");
    }
  });

  // Clear input
  clearBtn.addEventListener("click", function () {
    jsonInput.value = "";
    resultsContainer.innerHTML = `<div class="flex items-center justify-center h-20 text-muted">
                    <div class="text-center">
                        <i data-feather="database" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
                        <p>Results will appear here...</p>
                    </div>
                </div>`;
    treeResult.style.display = "none";
    feather.replace();
    showNotification("Cleared successfully!", "success");
  });

  // Extract value by path
  valueByPathExtractBtn.addEventListener("click", extractValueByPath);
  pathInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") extractValueByPath();
  });

  function extractValueByPath() {
    try {
      const json = JSON.parse(jsonInput.value);
      const path = pathInput.value.trim();
      if (!path) {
        resultsContainer.innerHTML = `<div class="text-error p-4 text-center">
                            <i data-feather="alert-triangle" class="w-8 h-8 mx-auto mb-2"></i>
                            <p>Please enter a path</p>
                        </div>`;
        feather.replace();
        return;
      }
      const value = getValueByPath(json, path);
      if (value === undefined) {
        resultsContainer.innerHTML = `<div class="text-warning p-4 text-center">
                            <i data-feather="search" class="w-8 h-8 mx-auto mb-2"></i>
                            <p>No value found at path: ${path}</p>
                        </div>`;
      } else {
        resultsContainer.innerHTML = `<pre class="text-success whitespace-pre-wrap">${JSON.stringify(
          value,
          null,
          2,
        )}</pre>`;
      }
      feather.replace();
    } catch (e) {
      resultsContainer.innerHTML = `<div class="text-error p-4 text-center">
                        <i data-feather="alert-circle" class="w-8 h-8 mx-auto mb-2"></i>
                        <p>Error: ${e.message}</p>
                    </div>`;
      feather.replace();
    }
  }

  // Search by key
  searchBtn.addEventListener("click", searchByKey);
  searchKey.addEventListener("keypress", function (e) {
    if (e.key === "Enter") searchByKey();
  });

  function searchByKey() {
    try {
      const json = JSON.parse(jsonInput.value);
      const key = searchKey.value.trim();
      if (!key) {
        resultsContainer.innerHTML = `<div class="text-error p-4 text-center">
                            <i data-feather="alert-triangle" class="w-8 h-8 mx-auto mb-2"></i>
                            <p>Please enter a search key</p>
                        </div>`;
        feather.replace();
        return;
      }
      const results = findAllValuesByKey(json, key);
      if (results.length === 0) {
        resultsContainer.innerHTML = `<div class="text-warning p-4 text-center">
                            <i data-feather="search" class="w-8 h-8 mx-auto mb-2"></i>
                            <p>No values found for key "${key}"</p>
                        </div>`;
      } else {
        let html = '<div class="space-y-3">';
        results.forEach((result) => {
          const valueStr =
            typeof result.value === "object"
              ? JSON.stringify(result.value, null, 2)
              : result.value;
          html += `
                                <div class="json-item rounded-lg p-4 group hover:shadow-lg transition-all">
                                    <div class="flex items-start justify-between">
                                        <div class="flex-1 min-w-0">
                                            <div class="text-xs text-muted mb-1 font-medium">${
                                              result.path
                                            }</div>
                                            <div class="text-success break-all font-mono text-sm">${escapeHtml(
                                              valueStr,
                                            )}</div>
                                        </div>
                                        <button class="copy-item-btn ml-3 btn-secondary p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" data-value="${escapeHtml(
                                          valueStr,
                                        )}">
                                            <i data-feather="copy" class="w-4 h-4"></i>
                                        </button>
                                    </div>
                                </div>
                            `;
        });
        html += "</div>";
        resultsContainer.innerHTML = html;
        feather.replace();
      }
    } catch (e) {
      resultsContainer.innerHTML = `<div class="text-error p-4 text-center">
                        <i data-feather="alert-circle" class="w-8 h-8 mx-auto mb-2"></i>
                        <p>Error: ${e.message}</p>
                    </div>`;
      feather.replace();
    }
  }

  // Extract JSON button click handler
  extractJsonBtn.addEventListener("click", function () {
    if (jsonInput.value.trim() === "") {
      resultsContainer.innerHTML = `<div class="text-error p-4 text-center">
                        <i data-feather="alert-triangle" class="w-8 h-8 mx-auto mb-2"></i>
                        <p>Please enter JSON first</p>
                    </div>`;
      feather.replace();
      return;
    }

    try {
      const json = JSON.parse(jsonInput.value);
      resultsContainer.innerHTML = "";

      if (Array.isArray(json)) {
        let html = '<div class="space-y-4">';
        json.forEach((item, index) => {
          html += `<div class="item-card rounded-lg p-4">
                                <div class="flex items-center justify-between mb-3">
                                    <h3 class="font-semibold text-primary">Item ${
                                      index + 1
                                    }</h3>
                                    <span class="text-xs text-muted">${typeof item}</span>
                                </div>
                                <div class="space-y-3">`;

          if (typeof item === "object" && item !== null) {
            for (const [key, value] of Object.entries(item)) {
              const valueStr =
                typeof value === "object"
                  ? JSON.stringify(value, null, 2)
                  : value;
              html += `
                                        <div class="json-item rounded-lg p-3 group">
                                            <div class="flex items-start justify-between">
                                                <div class="flex-1 min-w-0">
                                                    <div class="text-xs text-muted mb-1 font-medium">${key}</div>
                                                    <div class="text-success break-all font-mono text-sm">${escapeHtml(
                                                      valueStr,
                                                    )}</div>
                                                </div>
                                                <button class="copy-item-btn ml-3 btn-secondary p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" data-value="${escapeHtml(
                                                  valueStr,
                                                )}">
                                                    <i data-feather="copy" class="w-4 h-4"></i>
                                                </button>
                                            </div>
                                        </div>
                                    `;
            }
          } else {
            html += `<div class="text-secondary">${item}</div>`;
          }

          html += `</div></div>`;
        });
        html += "</div>";
        resultsContainer.innerHTML = html;
      } else if (typeof json === "object") {
        let html = '<div class="space-y-3">';
        for (const [key, value] of Object.entries(json)) {
          const valueStr =
            typeof value === "object" ? JSON.stringify(value, null, 2) : value;
          html += `
                                <div class="json-item rounded-lg p-4 group hover:shadow-lg transition-all">
                                    <div class="flex items-start justify-between">
                                        <div class="flex-1 min-w-0">
                                            <div class="text-xs text-muted mb-1 font-medium">${key}</div>
                                            <div class="text-success break-all font-mono text-sm">${escapeHtml(
                                              valueStr,
                                            )}</div>
                                        </div>
                                        <button class="copy-item-btn ml-3 btn-secondary p-2 rounded-lg opacity-opacity group-hover:opacity-100 transition-opacity" data-value="${escapeHtml(
                                          valueStr,
                                        )}">
                                            <i data-feather="copy" class="w-4 h-4"></i>
                                        </button>
                                    </div>
                                </div>
                            `;
        }
        html += "</div>";
        resultsContainer.innerHTML = html;
      } else {
        resultsContainer.innerHTML = `<div class="text-muted p-4 text-center">
                            <i data-feather="info" class="w-8 h-8 mx-auto mb-2"></i>
                            <p>No items found in this JSON</p>
                        </div>`;
      }

      // Display tree data with fixed numbering
      displayTreeData(json);
      feather.replace();
      showNotification("JSON extracted successfully!", "success");
    } catch (e) {
      resultsContainer.innerHTML = `<div class="text-error p-4 text-center">
                        <i data-feather="alert-circle" class="w-8 h-8 mx-auto mb-2"></i>
                        <p>Invalid JSON: ${e.message}</p>
                    </div>`;
      feather.replace();
      showNotification("Invalid JSON format!", "error");
    }
  });

  function displayTreeData(data) {
    treeResult.innerHTML = `
                    <div class="p-6">
                        <h2 class="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                            <i data-feather="git-branch" class="w-5 h-5 text-indigo-400"></i>
                            Object Tree Explorer
                            <span class="item-count">${
                              countJsonItems(data).total
                            } total items</span>
                        </h2>
                        <div id="tree-content" class="space-y-2"></div>
                    </div>
                `;

    const treeContent = document.getElementById("tree-content");
    processTreeData(data, "", treeContent);
    treeResult.style.display = "block";
    feather.replace();
  }

  // Fixed numbering system - each parent has its own counter
  function processTreeData(data, parentKey, parentElement) {
    if (typeof data === "object" && data !== null) {
      const isArray = Array.isArray(data);
      let localCounter = 0; // Reset counter for each parent

      for (const [key, value] of isArray
        ? data.entries()
        : Object.entries(data)) {
        localCounter++; // Increment local counter
        const itemKey = isArray
          ? `${parentKey}[${key}]`
          : parentKey
          ? `${parentKey}.${key}`
          : key;

        if (typeof value === "object" && value !== null) {
          const subItemCount = countJsonItems(value);
          const container = document.createElement("div");
          container.className = "border-l-2 border-indigo-500/20 pl-4";

          const header = document.createElement("div");
          header.className =
            "flex items-center justify-between p-3 cursor-pointer item-card rounded-lg mb-2 hover:shadow-lg transition-all";
          header.innerHTML = `
                                <div class="flex items-center gap-2">
                                    <span class="item-number">${localCounter}</span>
                                    <i data-feather="chevron-right" class="text-indigo-400 w-4 h-4 transition-transform duration-200"></i>
                                    <span class="font-medium text-primary">${key}</span>
                                    <span class="text-xs text-muted px-2 py-1 rounded-full" style="background: var(--input-bg);">${
                                      isArray ? "array" : "object"
                                    }</span>
                                    <span class="item-count">${
                                      subItemCount.total
                                    } items</span>
                                </div>
                            `;

          const content = document.createElement("div");
          content.className = "hidden mt-2 ml-8 space-y-2";

          container.appendChild(header);
          container.appendChild(content);
          parentElement.appendChild(container);

          // Process nested items - each will have its own numbering starting from 1
          processTreeData(value, itemKey, content);

          header.addEventListener("click", function () {
            const icon = header.querySelector("i");
            if (content.classList.contains("hidden")) {
              content.classList.remove("hidden");
              icon.style.transform = "rotate(90deg)";
            } else {
              content.classList.add("hidden");
              icon.style.transform = "rotate(0deg)";
            }
          });
        } else {
          createJsonItem(localCounter, itemKey, value, parentElement);
        }
      }
    }
  }

  function createJsonItem(number, key, value, parentElement) {
    const item = document.createElement("div");
    item.className =
      "json-item rounded-lg p-3 group hover:shadow-lg transition-all";

    const valueType = typeof value;
    let displayValue = value;
    let valueClass = "text-secondary";

    if (value === null) {
      displayValue = "null";
      valueClass = "text-muted";
    } else if (valueType === "boolean") {
      displayValue = value ? "true" : "false";
      valueClass = "text-purple-400";
    } else if (valueType === "number") {
      valueClass = "text-blue-400";
    } else if (valueType === "string") {
      displayValue = `"${value}"`;
      valueClass = "text-success";
    }

    item.innerHTML = `
                    <div class="flex items-start justify-between">
                        <div class="flex items-start gap-2 flex-1 min-w-0">
                            <span class="item-number">${number}</span>
                            <div class="flex-1 min-w-0">
                                <div class="text-xs text-muted mb-1 font-medium">${key}</div>
                                <div class="${valueClass} break-all font-mono text-sm">${displayValue}</div>
                            </div>
                        </div>
                        <button class="copy-item-btn ml-3 btn-secondary p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" data-value="${escapeHtml(
                          String(value),
                        )}">
                            <i data-feather="copy" class="w-4 h-4"></i>
                        </button>
                    </div>
                `;

    parentElement.appendChild(item);
  }

  // Copy results
  copyBtn.addEventListener("click", function () {
    const text = resultsContainer.textContent;
    navigator.clipboard.writeText(text).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML =
        '<i data-feather="check" class="w-4 h-4"></i><span>Copied!</span>';
      feather.replace();
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        feather.replace();
      }, 2000);
      showNotification("Results copied to clipboard!", "success");
    });
  });

  // Handle individual item copy
  document.addEventListener("click", function (e) {
    if (e.target.closest(".copy-item-btn")) {
      const btn = e.target.closest(".copy-item-btn");
      const value = btn.getAttribute("data-value");
      navigator.clipboard.writeText(value).then(() => {
        const icon = btn.querySelector("i");
        const originalFeather = icon.getAttribute("data-feather");
        icon.setAttribute("data-feather", "check");
        feather.replace();
        setTimeout(() => {
          icon.setAttribute("data-feather", originalFeather);
          feather.replace();
        }, 2000);
        showNotification("Item copied to clipboard!", "success");
      });
    }
  });

  // Notification system
  function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    const icons = {
      success: "check-circle",
      error: "alert-circle",
      warning: "alert-triangle",
    };
    const colors = {
      success: "bg-green-500/20 border-green-500/30 text-green-400",
      error: "bg-red-500/20 border-red-500/30 text-red-400",
      warning: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
    };

    notification.className = `fixed top-4 right-4 z-50 glass border rounded-lg p-4 flex items-center gap-2 transform translate-x-full transition-transform duration-300 ${colors[type]}`;
    notification.innerHTML = `
                    <i data-feather="${icons[type]}" class="w-5 h-5"></i>
                    <span>${message}</span>
                `;

    document.body.appendChild(notification);
    feather.replace();

    setTimeout(() => {
      notification.style.transform = "translateX(-96%)";
    }, 100);

    setTimeout(() => {
      notification.style.transform = "translateX(-96%)";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 100);
    }, 3000);
  }

  // Helper functions
  function escapeHtml(unsafe) {
    if (typeof unsafe !== "string") {
      unsafe = String(unsafe);
    }
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getValueByPath(obj, path) {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  }

  function findAllValuesByKey(obj, key, results = [], currentPath = "") {
    if (typeof obj !== "object" || obj === null) return results;

    for (const [k, v] of Object.entries(obj)) {
      const newPath = currentPath ? `${currentPath}.${k}` : k;
      if (k === key) {
        results.push({
          path: newPath,
          value: v,
        });
      }
      if (typeof v === "object" && v !== null) {
        findAllValuesByKey(v, key, results, newPath);
      }
    }
    return results;
  }
});
