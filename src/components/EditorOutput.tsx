import dynamic from "next/dynamic";
import Image from "next/image";
import { FC } from "react";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false }
);

interface EditorOutputProps {
  content: any;
}

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

const renderers = {
  image: CustomImageRenderer,
//   code: CustomCodeRenderer,
};

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <Output
      className="text-sm"
      renderers={renderers}
      style={style}
      data={content}
    />
  );
};

function CustomImageRenderer({ data }: any) {
    const src = data.file.url;

    return (
        <div className="relative w-full min-h-[15rem]">
            <Image alt="image" fill src={src} />
        </div>
    )
}

export default EditorOutput;
