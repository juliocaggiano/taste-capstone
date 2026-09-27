import { Fragment } from "react";

// Match the review's emphasis and quotations without changing approved words.
export function EditorialStory({ paragraphs }: { paragraphs: readonly string[] }) {
  return paragraphs.map((paragraph, index) => {
    const quote = paragraph.startsWith("> ");
    const text = quote ? paragraph.slice(2) : paragraph;
    const content = text.split(/(\*[^*]+\*)/g).map((part, i) =>
      part.startsWith("*") && part.endsWith("*")
        ? <em key={i}>{part.slice(1, -1)}</em>
        : <Fragment key={i}>{part}</Fragment>);
    return quote ? <blockquote key={index}>{content}</blockquote> : <p key={index}>{content}</p>;
  });
}
