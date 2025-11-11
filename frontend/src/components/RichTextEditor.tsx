import {
  EditorProvider,
  Editor,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnNumberedList,
  BtnBulletList,
  BtnLink,
  BtnUndo,
  BtnRedo,
  Separator,
  BtnStyles,
} from "react-simple-wysiwyg";
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {

  const handleInput = (e: any) => {
    onChange(e.target.value);
  };

  return (
    <EditorProvider>
      <Editor
        value={value}
        onChange={handleInput}
        placeholder={placeholder}
        className="min-h-[200px] max-h-[300px] overflow-y-auto overflow-x-hidden bg-white border border-gray-300 rounded-lg p-4
                  focus:outline-none focus:ring-2 focus:ring-blue-400 
                  prose prose-s w-full"
        style={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
              }}
      >
        <Toolbar className="bg-muted border-b border-input p-2 flex flex-wrap gap-1">
          <BtnBold />
          <BtnItalic />
          <BtnUnderline />
          <Separator />
          <BtnNumberedList />
          <BtnBulletList />
          <Separator />
          <BtnLink />
          <Separator />
          <BtnUndo />
          <BtnRedo />
          <Separator />
          <BtnStyles />
        </Toolbar>
      </Editor>
    </EditorProvider>
  );
}
