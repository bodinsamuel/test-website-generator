export type HTMLTemplateFunction = (args: {
  title: string;
  body: string;
}) => string;

export const DEFAULT_TEMPLATE: HTMLTemplateFunction = ({ title, body }) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <title>${title}</title>
  <meta name='viewport' content='width=device-width, initial-scale=1'>
</head>
<body>
  ${body}
</body>
</html>`;
};
