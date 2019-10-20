export type ArticleBodyTemplate = (args: {
  title: string;
  author: string;
  text: string;
}) => string;

export const ARTICLE_BODY: ArticleBodyTemplate = ({ title, author, text }) => {
  return `
  <div class="article">
    <h1>${title}</h1>
    <div class="author">By ${author}</div>
    <div>${text}</div>
  </div>
  `;
};
