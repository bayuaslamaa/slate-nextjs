import Link from "next/link";
import React, { useMemo, useState, useCallback } from "react";
import { createEditor, Transforms, Editor, Text } from "slate";
import { Slate, Editable, withReact } from "slate-react";

interface State {
  type: string;
  children: ChildText[];
}
interface ChildText {
  text: string;
}
export default function SlateComponent() {
  const CustomEditor = {
    isBoldMarkActive(editor: any) {
      const [match]: any = Editor.nodes(editor, {
        match: (n: any) => n.bold === true,
        universal: true,
      });

      return !!match;
    },

    isCodeBlockActive(editor: any) {
      const [match]: any = Editor.nodes(editor, {
        match: (n: any) => n.type === "code",
      });

      return !!match;
    },

    toggleBoldMark(editor: any) {
      const isActive = CustomEditor.isBoldMarkActive(editor);
      Transforms.setNodes(editor, { bold: isActive ? null : true } as any, {
        match: (n) => Text.isText(n),
        split: true,
      });
    },

    toggleCodeBlock(editor: any) {
      const isActive = CustomEditor.isCodeBlockActive(editor);
      Transforms.setNodes(editor, { type: isActive ? null : "code" } as any, {
        match: (n) => Editor.isBlock(editor, n),
      });
    },
  };
  const initialState: State[] = [
    { type: "paragraph", children: [{ text: "type here..." }] },
  ];
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState(initialState);
  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);
  const renderLeaf = useCallback((props: any) => {
    return <Leaf {...props} />;
  }, []);
  return (
    <div style={{padding: 20}}>
        <h3>Hey! Welcome to Simple Rich Text Editor <small>(by Bayu)</small></h3>
        <p> Here is you can do: </p>
        <ul>
            <li>You can switch to <b>code blocks</b> by toggle <code> ctrl + {"\'\`\'"}</code></li>
            <li>You can make your text  <b>bold</b> by toggle <code> ctrl + {"\'b\'"}</code></li>
            <li>Another functions is on progress, please enjoy it and let me know if you want to contribute, Check <a href="https://github.com/bayuaslamaa/slate-nextjs"> <u>Github Repo</u></a></li>
        </ul>
    <div
      style={{
        border: "1px solid gray",
        borderRadius: 10,
        padding: 12,
      }}
    >
      <Slate
        editor={editor}
        value={value}
        onChange={(newVal: any) => setValue(newVal)}
      >
        <Editable
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          onKeyDown={(event) => {
            if (!event.ctrlKey) {
              return;
            }
            switch (event.key) {
                case '`': {
                  event.preventDefault()
                  CustomEditor.toggleCodeBlock(editor)
                  break
                }
    
                case 'b': {
                  event.preventDefault()
                  CustomEditor.toggleBoldMark(editor)
                  break
                }
              }
          }}
        />
      </Slate>
    </div>
    </div>
  );
}

// Define a React component renderer for our code blocks.
const CodeElement = (props: any) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const Leaf = (props: any) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
    >
      {props.children}
    </span>
  );
};
