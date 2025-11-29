# DAC Viewer

**DAC Viewer** (Diagram-as-Code Viewer) is a powerful desktop application for creating, viewing, and exporting diagrams. It supports both **Mermaid** (offline) and **PlantUML** (via Kroki) diagrams with a live preview, syntax highlighting, and easy export options.

> **Built by Gemini 3 Pro using Antigravity IDE**

## 🚀 Features

*   **Dual Diagram Support**: Seamlessly switch between **Mermaid** and **PlantUML**.
*   **Live Preview**: See your changes instantly as you type.
*   **Kroki Integration**: Reliable PlantUML rendering powered by [Kroki](https://kroki.io).
*   **Export to PNG**: High-quality export of your current diagram view.
*   **Smart Editor**:
    *   Syntax highlighting for Mermaid and PlantUML (Java-like).
    *   Dark mode for comfortable editing.
    *   Code view toggle for distraction-free viewing.
*   **Interactive Preview**: Pan and zoom support for large diagrams.
*   **File Operations**: Open and Save `.mmd`, `.txt`, `.puml`, and `.plantuml` files.
*   **Cross-Platform**: Available for macOS (Intel & Apple Silicon) and Windows.

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
| :--- | :--- |
| **Open File** | `Cmd/Ctrl + O` |
| **Save File** | `Cmd/Ctrl + S` |
| **Export PNG** | `Cmd/Ctrl + E` |
| **Toggle Code** | `Cmd/Ctrl + B` |
| **Refresh** | `Cmd/Ctrl + R` |

## 🛠️ Development

### Prerequisites
- Node.js (v16 or higher)
- npm

### Setup
```bash
# Install dependencies
npm install
```

### Run Locally
```bash
# Run both Vite (renderer) and Electron (main)
npm run dev
```

### Build
```bash
# Build for macOS and Windows
npm run build
```

## 🏗️ Tech Stack

- **Electron**: Desktop application framework.
- **React**: UI library.
- **Vite**: Fast build tool.
- **CodeMirror 6**: Code editor component.
- **Mermaid.js**: Local Mermaid rendering.
- **Pako**: Deflate compression for Kroki API.
