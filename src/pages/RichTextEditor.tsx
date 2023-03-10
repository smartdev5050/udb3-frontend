import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import dynamic from 'next/dynamic';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(({ Editor }) => Editor),
  { ssr: false },
);

function RichTextEditor({ editorState, onInput, onBlur }) {
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
