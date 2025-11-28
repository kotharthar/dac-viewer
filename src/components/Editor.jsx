import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { mermaid } from 'codemirror-lang-mermaid';
import { java } from '@codemirror/lang-java'; // Using Java as a close approximation for PlantUML syntax

const Editor = ({ value, onChange, type }) => {
  const extensions = type === 'plantuml' ? [java()] : [mermaid()];

  return (
    <CodeMirror
      value={value}
      height="100%"
      theme="dark"
      extensions={extensions}
      onChange={onChange}
      className="editor"
    />
  );
};

export default Editor;
