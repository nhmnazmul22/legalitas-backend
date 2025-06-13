"use client";

import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CKEditorWrapper = ({
  content,
  setContent,
}: {
  content: string;
  setContent: (html: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="content">Contents</label>
      <div className="editor border border-gray-300 rounded-md overflow-hidden">
        <CKEditor
          editor={ClassicEditor as any}
          data={content}
          onChange={(_, editor) => {
            const html = editor.getData();
            setContent(html);
          }}
          config={{
            toolbar: [
              "heading",
              "|",
              "bold",
              "italic",
              "link",
              "bulletedList",
              "numberedList",
              "|",
              "blockQuote",
              "insertTable",
              "undo",
              "redo",
            ],
            ui: {
              viewportOffset: { top: 20 },
            },
          }}
        />
      </div>
      <style jsx global>{`
        .ck-editor__editable {
          min-height: 400px !important;
        }
      `}</style>
    </div>
  );
};

export default CKEditorWrapper;
