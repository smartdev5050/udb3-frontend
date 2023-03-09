import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { Editor } from 'react-draft-wysiwyg';

function RichTextEditor({ editorState, onInput, onBlur }) {
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div style={{ background: 'white', borderRadius: 10, padding: 10 }}>
      <Editor
        editorState={editorState}
        onEditorStateChange={(editorState) => onInput(editorState)}
        onBlur={onBlur}
      />
    </div>
  );
}

export default RichTextEditor;
