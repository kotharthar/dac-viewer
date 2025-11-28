import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  flowchart: { htmlLabels: false },
  securityLevel: 'loose'
});

const Preview = ({ code }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (containerRef.current && code) {
        try {
          console.log('Rendering mermaid diagram...');
          containerRef.current.innerHTML = '';
          const { svg } = await mermaid.render('mermaid-svg', code);
          containerRef.current.innerHTML = svg;
          console.log('Mermaid rendered successfully');
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          containerRef.current.innerHTML = `<div style="color: red; padding: 10px;">Error rendering diagram: ${error.message}</div>`;
        }
      }
    };

    renderDiagram();
  }, [code]);

  return (
    <div className="preview-container" style={{ height: '100%', overflow: 'hidden', backgroundColor: 'white' }}>
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        centerOnInit={true}
      >
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }}>
          <div ref={containerRef} className="mermaid-output" style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default Preview;
