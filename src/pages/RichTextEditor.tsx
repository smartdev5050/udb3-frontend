import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';

import { CustomRichTextEditorLink } from '@/pages/CustomRichTextEditorLink';
import { getValueFromTheme } from '@/ui/theme';

const getValue = getValueFromTheme(`richTextEditor`);

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(({ Editor }) => Editor),
  { ssr: false },
);

function RichTextEditor(props: ComponentProps<typeof Editor>) {
  return (
    <div
      css={`
        background: white;
        border-radius: 10px;
        overflow: hidden;
        width: 100%;
        border: 1px solid ${getValue('borderColor')}};
      `}
    >
      <Editor
        toolbar={{
          options: ['inline', 'list', 'history', 'link'],
          inline: {
            inDropdown: false,
            options: ['bold', 'italic'],
          },
          link: {
            defaultTargetOption: '_blank',
            component: CustomRichTextEditorLink,
          },
        }}
        handlePastedText={() => false}
        editorStyle={{ minHeight: 250, resize: 'vertical' }}
        {...props}
      />
    </div>
  );
}

export default RichTextEditor;
