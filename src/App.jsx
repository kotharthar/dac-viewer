import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { FaFolderOpen, FaSave, FaFileImage, FaCode, FaEyeSlash, FaSync } from 'react-icons/fa';
import './App.css';

const DEFAULT_CODE = `graph TD
  A[Start] --> B{Is it working?}
  B -- Yes --> C[Great!]
  B -- No --> D[Debug]`;

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [filePath, setFilePath] = useState(null);
  const [fileType, setFileType] = useState('mermaid'); // 'mermaid' or 'plantuml'
  const [isEditorVisible, setIsEditorVisible] = useState(true);
  const [editorWidth, setEditorWidth] = useState(50); // Percentage
  const [status, setStatus] = useState('Ready');
  const [isDragging, setIsDragging] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const detectType = (content) => {
    if (content.includes('@startuml') || content.includes('@enduml')) {
      return 'plantuml';
    }
    return 'mermaid';
  };

  const handleCodeChange = (value) => {
    setCode(value);
    const type = detectType(value);
    if (type !== fileType) {
      setFileType(type);
    }
  };

  const handleOpen = async () => {
    if (window.electronAPI) {
      const result = await window.electronAPI.readFile();
      if (result) {
        setCode(result.content);
        setFilePath(result.path);
        // Prioritize extension, fallback to content detection
        let type = 'mermaid';
        if (result.path.endsWith('.puml') || result.path.endsWith('.plantuml')) {
          type = 'plantuml';
        } else if (result.path.endsWith('.mmd')) {
          type = 'mermaid';
        } else {
          type = detectType(result.content);
        }
        setFileType(type);
        setStatus(`Opened ${result.path} (${type})`);
      }
    }
  };

  const handleSave = async () => {
    if (window.electronAPI) {
      const result = await window.electronAPI.saveFile({ path: filePath, content: code });
      if (result) {
        setFilePath(result.path);
        let type = 'mermaid';
        if (result.path.endsWith('.puml') || result.path.endsWith('.plantuml')) {
          type = 'plantuml';
        } else if (result.path.endsWith('.mmd')) {
          type = 'mermaid';
        } else {
          type = detectType(code);
        }
        setFileType(type);
        setStatus(`Saved to ${result.path}`);
      }
    }
  };

  const handleExport = async () => {
    setStatus('Exporting...');
    const element = document.querySelector('.mermaid-output');

    if (!element) {
      console.error('Element not found');
      setStatus('Export failed: Element not found');
      return;
    }

    if (window.electronAPI) {
      try {
        const pane = document.querySelector('.preview-pane');
        const paneRect = pane.getBoundingClientRect();

        const result = await window.electronAPI.capturePage({
          x: paneRect.x,
          y: paneRect.y,
          width: paneRect.width,
          height: paneRect.height
        });

        if (result) {
          setStatus(`Exported to ${result.path}`);
        } else {
          setStatus('Export canceled');
        }
      } catch (error) {
        console.error('Export failed:', error);
        setStatus(`Export failed: ${error.message}`);
      }
    } else {
      console.error('Electron API not available');
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    setStatus('Refreshed diagram');
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault(); // Prevent text selection
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'o') {
        e.preventDefault();
        handleOpen();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        handleExport();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setIsEditorVisible(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault();
        handleRefresh();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, filePath, fileType, isEditorVisible]); // Dependencies for handlers

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 10 && newWidth < 90) {
        setEditorWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="app-container">
      <div className="toolbar">
        <button onClick={handleOpen} title="Open File (Cmd/Ctrl + O)">
          <FaFolderOpen /> <span>Open</span>
        </button>
        <button onClick={handleSave} title="Save File (Cmd/Ctrl + S)">
          <FaSave /> <span>Save</span>
        </button>
        <button onClick={handleExport} title="Export as PNG (Cmd/Ctrl + E)">
          <FaFileImage /> <span>Export PNG</span>
        </button>
        <button onClick={() => setIsEditorVisible(!isEditorVisible)} title={isEditorVisible ? "Hide Code Editor (Cmd/Ctrl + B)" : "Show Code Editor (Cmd/Ctrl + B)"}>
          {isEditorVisible ? <><FaEyeSlash /> <span>Hide Code</span></> : <><FaCode /> <span>Show Code</span></>}
        </button>
      </div>
      <div className="main-content">
        {isEditorVisible && (
          <div className="pane editor-pane" style={{ width: `${editorWidth}%` }}>
            <Editor value={code} onChange={handleCodeChange} type={fileType} />
          </div>
        )}
        {isEditorVisible && (
          <div className="resizer" onMouseDown={handleMouseDown} />
        )}
        <div className="pane preview-pane" style={{ width: isEditorVisible ? `${100 - editorWidth}%` : '100%', position: 'relative' }}>
          <button
            className="refresh-button"
            onClick={handleRefresh}
            title="Manual Refresh (Cmd/Ctrl + R)"
            style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 100, background: 'rgba(255,255,255,0.8)', border: '1px solid #ccc', borderRadius: '4px', padding: '5px', cursor: 'pointer' }}
          >
            <FaSync />
          </button>
          <Preview code={code} type={fileType} refreshTrigger={refreshTrigger} />
        </div>
      </div>
      <div className="status-bar">
        <span>{filePath || 'Untitled'}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="status-message">{status}</span>
          <FaSync onClick={handleRefresh} style={{ cursor: 'pointer' }} title="Refresh (Cmd/Ctrl + R)" />
        </div>
      </div>
    </div>
  );
}

export default App;
