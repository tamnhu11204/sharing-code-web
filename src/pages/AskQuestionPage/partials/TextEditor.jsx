import React from 'react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ value, onChange, placeholder }) => {
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'bullet' }],
      ['link'],
      [{ 'align': [] }],
    ],
  };

  return (
    <div className="editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextEditor;
