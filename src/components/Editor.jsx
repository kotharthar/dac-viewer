import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { mermaid } from 'codemirror-lang-mermaid';

const Editor = ({ value, onChange }) => {
  return (
    <div className="editor-container" style={{ height: '100%', overflow: 'auto' }}>
      <CodeMirror
        value={value}
        height="100%"
        extensions={[mermaid()]}
        onChange={onChange}
        theme="dark"
      />
    </div>
  );
};

export default Editor;
