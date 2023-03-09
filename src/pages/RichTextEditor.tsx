import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { ContentState, convertFromRaw, EditorState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { useMemo } from 'react';
import { Editor } from 'react-draft-wysiwyg';

function RichTextEditor({ value, onInput, onBlur }) {
  if (typeof window === 'undefined') {
    return null;
  }

  const editorState = useMemo(() => {
    const blocksFromHtml = htmlToDraft(value);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap,
    );

    return EditorState.createWithContent(contentState);
  }, [value]);

  return (
    <div style={{ background: 'white', borderRadius: 10, padding: 10 }}>
      <Editor
        defaultEditorState={editorState}
        onChange={(rawContentState) => onInput(convertFromRaw(rawContentState))}
        onBlur={onBlur}
      />
    </div>
  );
}

export default RichTextEditor;
