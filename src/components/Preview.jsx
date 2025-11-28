import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import pako from 'pako';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  flowchart: { htmlLabels: false },
  securityLevel: 'loose'
});

const Preview = ({ code, type, refreshTrigger }) => {
  const containerRef = useRef(null);
  const [plantUmlUrl, setPlantUmlUrl] = useState(null);

  const textEncode = (str) => {
    if (!str) return '';
    const buffer = new TextEncoder('utf-8').encode(str);
    const compressed = pako.deflate(buffer, { level: 9 });
    // Convert Uint8Array to binary string
    let binary = '';
    const len = compressed.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(compressed[i]);
    }
    const base64 = btoa(binary);

    const result = base64.replace(/\+/g, '-').replace(/\//g, '_');
    return result;
  };

  useEffect(() => {
    const renderDiagram = async () => {
      if (type === 'plantuml') {
        setPlantUmlUrl(null); // Clear previous PlantUML URL
        if (code) {
          try {
            const encoded = textEncode(code);
            // Kroki URL format: https://kroki.io/plantuml/svg/{encoded}
            setPlantUmlUrl(`https://kroki.io/plantuml/svg/${encoded}?t=${Date.now()}`);
            if (containerRef.current) {
              containerRef.current.innerHTML = ''; // Clear Mermaid content
            }
          } catch (error) {
            console.error('Kroki encoding error:', error);
            if (containerRef.current) {
              containerRef.current.innerHTML = `<div style="color: red; padding: 10px;">Error encoding PlantUML: ${error.message}</div>`;
            }
          }
        } else {
          if (containerRef.current) {
            containerRef.current.innerHTML = '';
          }
        }
      } else { // Assume mermaid or other type
        setPlantUmlUrl(null); // Clear PlantUML URL
        if (containerRef.current && code) {
          try {
            console.log('Rendering mermaid diagram...');
            containerRef.current.innerHTML = '';
            // Mermaid might cache, so we might need to reset.
            // But mermaid.render usually re-renders.
            const { svg } = await mermaid.render('mermaid-svg-' + Date.now(), code);
            containerRef.current.innerHTML = svg;
            console.log('Mermaid rendered successfully');
          } catch (error) {
            console.error('Mermaid rendering error:', error);
            containerRef.current.innerHTML = `<div style="color: red; padding: 10px;">Error rendering diagram: ${error.message}</div>`;
          }
        } else if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      }
    };

    renderDiagram();
  }, [code, type, refreshTrigger]);

  return (
    <div className="preview-container" style={{ height: '100%', overflow: 'hidden', backgroundColor: 'white' }}>
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        centerOnInit={true}
      >
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }}>
          <div ref={containerRef} className="mermaid-output" style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {type === 'plantuml' && plantUmlUrl && (
              <img src={plantUmlUrl} alt="PlantUML Diagram" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default Preview;
