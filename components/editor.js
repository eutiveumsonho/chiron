import { DiffEditor } from "@monaco-editor/react";
import { useEffect } from "react";

export function ScriptEditor(props) {
  const {
    code,
    originalCode,
    editorOptions,
    onInitializePane,
    monacoEditorRef,
    editorRef,
  } = props;

  useEffect(() => {
    if (monacoEditorRef?.current) {
      const model = monacoEditorRef.current.getModels();

      if (model?.length > 0) {
        onInitializePane(monacoEditorRef, editorRef, model);
      }
    }
  }, []);

  return (
    <DiffEditor
      height="42.9rem"
      language="json"
      onMount={(editor, monaco) => {
        monacoEditorRef.current = monaco.editor;
        editorRef.current = editor;
      }}
      options={editorOptions}
      theme="light"
      modified={code}
      original={originalCode}
    />
  );
}

export default ScriptEditor;
