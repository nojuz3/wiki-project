import React, { useState,useEffect } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import Markdown from "react-markdown";

const block = [

  commands.title,
  commands.hr,
  commands.bold,
  commands.italic,
  commands.link,
  commands.image,
  commands.unorderedListCommand,
  commands.orderedListCommand,
];



export default function Md({text,setText}) {
  return (
    <div class="editor">
      <MDEditor
        value={text}
        onChange={setText}
        commands={block}
        preview="edit"
        height={"40vh"}
        extraCommands={[]}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
          disallowedElements: ['script'],
        }}
      />
      <MDEditor.Markdown style={{ whiteSpace: "pre-wrap" }} />
    </div>
  );
}
