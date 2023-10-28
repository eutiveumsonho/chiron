import { DiffEditor, Editor } from "@monaco-editor/react";
import { useEffect } from "react";

export function ScriptEditor(props) {
  const {
    code,
    originalCode,
    onInitializePane,
    monacoEditorRef,
    editorRef,
    readOnly,
  } = props;

  useEffect(() => {
    if (monacoEditorRef?.current) {
      const model = monacoEditorRef.current.getModels();

      if (model?.length > 0) {
        onInitializePane(monacoEditorRef, editorRef, model);
      }
    }
  }, []);

  if (readOnly) {
    return (
      <Editor
        height="42.9rem"
        language="json"
        onMount={(editor, monaco) => {
          monacoEditorRef.current = monaco.editor;
          editorRef.current = editor;
        }}
        options={{
          readOnly: true,
        }}
        theme="light"
        defaultValue={originalCode}
      />
    );
  }

  return (
    <DiffEditor
      height="42.9rem"
      language="json"
      onMount={(editor, monaco) => {
        monacoEditorRef.current = monaco.editor;
        editorRef.current = editor;
      }}
      theme="light"
      modified={code}
      original={originalCode}
    />
  );
}

export default ScriptEditor;
