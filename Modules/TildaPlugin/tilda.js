import tinymce from 'tinymce';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

tinymce.PluginManager.add('tilda', function (editor) {
  let btn;
  let disabledDiv;
  let infoIcon;

  const createCommonContent = () => `
    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="16" height="16">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
    <span>TILDA</span>
  `;

  const styleElement = (el) => {
    el.style.position = 'absolute';
    el.style.top = '5px';
    el.style.right = '10px';
    el.style.background = 'linear-gradient(90deg, #7f5af0 0%, #9c5fff 100%)';
    el.style.color = '#fff';
    el.style.border = 'none';
    el.style.padding = '8px 16px';
    el.style.borderRadius = '6px';
    el.style.fontWeight = 'bold';
    el.style.fontSize = '14px';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.gap = '8px';
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
  };

  const styleInfoIcon = (el) => {
    el.style.position = 'absolute';
    el.style.top = '15px';          // align vertically with button
    el.style.right = '115px';      // place left of button (adjust as needed)
    el.style.color = '#354555;';
    el.style.fontSize = '16px';
    el.style.cursor = 'pointer';
    el.style.userSelect = 'none';
  };

  const checkBannerAndToggleButton = () => {
    const hasBanner = editor.getBody().querySelector('.tilda-banner');

    if (!btn || !disabledDiv) return;

    if (btn._tippy) {
      btn._tippy.destroy();
    }
    if (disabledDiv._tippy) {
      disabledDiv._tippy.destroy();
    }

    if (hasBanner) {
      // Show disabledDiv with tooltip
      btn.style.display = 'none';

      disabledDiv.style.display = 'flex';
      disabledDiv.style.opacity = '0.5';
      disabledDiv.style.cursor = 'not-allowed';

      tippy(disabledDiv, {
        content: 'Answer BSQs to unlock first draft generation.',
        theme: 'light',
        placement: 'bottom',
        trigger: 'mouseenter focus',
      });

    } else {
      // Show normal clickable button
      disabledDiv.style.display = 'none';

      btn.style.display = 'flex';
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
    }
  };

  editor.on('init', function () {
    const toolbar = editor.getContainer().querySelector('.tox-editor-header');

    // Create the clickable button
    btn = document.createElement('button');
    btn.innerHTML = createCommonContent();
    styleElement(btn);
    btn.style.cursor = 'pointer';

    btn.onclick = () => {
      const tildaEvent = new CustomEvent('tilda-clicked', {
        detail: { editorId: editor.id },
        bubbles: true,
      });
      editor.getContainer().dispatchEvent(tildaEvent);
    };

    // Create the disabled div (non-clickable)
    disabledDiv = document.createElement('div');
    disabledDiv.innerHTML = createCommonContent();
    styleElement(disabledDiv);
    disabledDiv.style.cursor = 'not-allowed';
    disabledDiv.style.userSelect = 'none'; // optional, to prevent text selection
    disabledDiv.tabIndex = 0; // for focus and tooltip trigger
    disabledDiv.style.display = 'none'; // start hidden

    // info tooltip
    infoIcon = document.createElement('span');
    infoIcon.className = 'entypo--info-circled';
    styleInfoIcon(infoIcon);

    toolbar.style.position = 'relative';
    toolbar.appendChild(btn);
    toolbar.appendChild(disabledDiv);
    toolbar.appendChild(infoIcon);

    tippy(infoIcon, {
		content:
			'<p class="mb-1"><strong>What is Tilda?</strong> Your smart SEF-writing assistant.</p><ul class="mb-1"><li><strong>Work with your existing text:</strong> tighten, reorganise, and correct your draft.</li><li><strong>Auto-draft from BSQs:</strong> Turn completed Bite-Sized Questions into an Ofsted-aligned first draft.</li><li><strong>Guided prompts:</strong> Get instant suggestions for structure, tone, and key criteria.</li></ul><p class="mb-1">Every suggestion follows a proven format and tone, fully aligned to the Ofsted Inspection Framework.</p>',
		theme: "light",
		placement: "bottom",
		trigger: "click focus",
		allowHTML: true,
	});

    checkBannerAndToggleButton();

    editor.on('NodeChange KeyUp SetContent', checkBannerAndToggleButton);
  });
});
