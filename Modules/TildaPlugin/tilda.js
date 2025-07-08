import tinymce from 'tinymce';

tinymce.PluginManager.add('tilda', function (editor) {
  editor.on('init', function () {
    const toolbar = editor.getContainer().querySelector('.tox-editor-header');
    const btn = document.createElement('button');

    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="16" height="16">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
      <span>TILDA</span>
    `;

    btn.style.position = 'absolute';
    btn.style.top = '5px';
    btn.style.right = '10px';
    btn.style.background = 'linear-gradient(90deg, #7f5af0 0%, #9c5fff 100%)'; // purple gradient
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.padding = '8px 16px';
    btn.style.borderRadius = '6px';
    btn.style.fontWeight = 'bold';
    btn.style.fontSize = '14px';
    btn.style.cursor = 'pointer';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.gap = '8px';
    btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

    btn.onclick = () => {
      const tildaEvent = new CustomEvent('tilda-clicked', {
        detail: { editorId: editor.id },
        bubbles: true,
      });
      editor.getContainer().dispatchEvent(tildaEvent);
    };

    toolbar.style.position = 'relative';
    toolbar.appendChild(btn);
  });
});
