import katex from 'katex';

const escapeHtml = content => {
  return content
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

const encodePost = content => {
  return { __html: content
    .replaceAll(/\n+/g, '<br>')
    .replaceAll(/\$\$(.*?)\$\$/g, (_match, math) => katex.renderToString(math, { throwOnError: false }))
  };
}

const encodePostPreview = content => {
  return { __html: escapeHtml(content)
    .replaceAll(/\n+/g, '<br>')
    .replaceAll(/\$\$(.*?)\$\$/g, (_match, math) => katex.renderToString(math, { throwOnError: false }))
  };
}

export { escapeHtml, encodePost, encodePostPreview };