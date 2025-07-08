import tinymce from 'tinymce';

tinymce.PluginManager.add('tilda', function (editor) {
  editor.on('init', function () {
    const toolbar = editor.getContainer().querySelector('.tox-editor-header');
    const btn = document.createElement('button');
    btn.innerText = 'Tilda';
    btn.style.position = 'absolute';
    btn.style.top = '10px';
    btn.style.right = '10px';
    btn.style.backgroundColor = '#28a745';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.padding = '5px 10px';
    btn.style.borderRadius = '4px';
    btn.style.fontWeight = 'bold';
    btn.style.cursor = 'pointer';
    btn.onclick = () => editor.fire('tildaClick');
    toolbar.style.position = 'relative';
    toolbar.appendChild(btn);
  });
});
