# DAC Viewer Project Context

## Overview
DAC Viewer (Diagram-as-Code Viewer) is a desktop application for creating, viewing, and exporting diagrams. It supports **Mermaid** (offline) and **PlantUML** (via Kroki) diagrams.

## Tech Stack
- **Framework**: Electron + React + Vite
- **Editor**: CodeMirror 6 (`@uiw/react-codemirror`)
- **Rendering**:
  - **Mermaid**: `mermaid` package (local rendering)
  - **PlantUML**: `pako` for Deflate + Base64Url encoding -> `kroki.io` (remote rendering)
- **Build Tool**: `electron-builder`

## Key Files
- **`electron/main.cjs`**: Main process. Handles window creation, file I/O, and native dialogs via IPC.
- **`electron/preload.cjs`**: Preload script. Exposes `electronAPI` to the renderer.
- **`src/App.jsx`**: Main React component. Manages state (code, file path, type), layout, and global shortcuts.
- **`src/components/Editor.jsx`**: CodeMirror editor wrapper. Supports Mermaid and Java (for PlantUML) syntax highlighting.
- **`src/components/Preview.jsx`**: Handles diagram rendering.
  - Uses `mermaid.render` for Mermaid.
  - Uses `pako` to encode PlantUML for Kroki.
  - Implements Pan & Zoom using `react-zoom-pan-pinch`.

## Development
- **Run Dev**: `npm run dev` (Runs Vite and Electron concurrently)
- **Build**: `npm run build` (Builds for macOS and Windows)

## Architecture Notes
- **IPC**: The renderer communicates with the main process via `window.electronAPI`.
- **File Type Detection**: `App.jsx` detects file types based on extension (`.mmd`, `.puml`) or content (`@startuml`).
- **Export**: Uses `capturePage` API in the main process to take a high-quality screenshot of the preview pane.
