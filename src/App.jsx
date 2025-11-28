import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { FaFolderOpen, FaSave, FaFileImage, FaCode, FaEyeSlash } from 'react-icons/fa';
import './App.css';

// ... (rest of imports and DEFAULT_CODE)

// ... (inside App component)



const DEFAULT_CODE = `graph TD
  A[Start] --> B{Is it working?}
  B -- Yes --> C[Great!]
  B -- No --> D[Debug]`;

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [filePath, setFilePath] = useState(null);
  const [isEditorVisible, setIsEditorVisible] = useState(true);
  const [editorWidth, setEditorWidth] = useState(50); // Percentage
  const [status, setStatus] = useState('Ready');
  const [isDragging, setIsDragging] = useState(false);

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleOpen = async () => {
    if (window.electronAPI) {
      const result = await window.electronAPI.readFile();
      if (result) {
        setCode(result.content);
        setFilePath(result.path);
        setStatus(`Opened ${result.path}`);
      }
    }
  };

  const handleSave = async () => {
    if (window.electronAPI) {
      const result = await window.electronAPI.saveFile({ path: filePath, content: code });
      if (result) {
        setFilePath(result.path);
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

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault(); // Prevent text selection
  };

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
        <button onClick={handleOpen}>Open</button>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleExport}>Export PNG</button>
        <button onClick={() => setIsEditorVisible(!isEditorVisible)}>
          {isEditorVisible ? 'Hide Code' : 'Show Code'}
        </button>
      </div>
      <div className="main-content">
        {isEditorVisible && (
          <div className="pane editor-pane" style={{ width: `${editorWidth}%` }}>
            <Editor value={code} onChange={handleCodeChange} />
          </div>
        )}
        {isEditorVisible && (
          <div className="resizer" onMouseDown={handleMouseDown} />
        )}
        <div className="pane preview-pane" style={{ width: isEditorVisible ? `${100 - editorWidth}%` : '100%' }}>
          <Preview code={code} />
        </div>
      </div>
      <div className="status-bar">
        <span>{filePath || 'Untitled'}</span>
        <span className="status-message">{status}</span>
      </div>
    </div>
  );
}

export default App;
