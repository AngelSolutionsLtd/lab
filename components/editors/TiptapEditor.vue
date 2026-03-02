<template>
  <div class="tiptap-root">

  <!-- Fixed-position tooltip for bubble menus -->
  <div v-if="bubbleTip.visible" class="tiptap__bubble-tip" :style="{ left: bubbleTip.x + 'px', top: bubbleTip.y + 'px' }">{{ bubbleTip.text }}</div>

  <div class="te-frame" :class="{ 'te-frame--fullscreen': isFullscreen, 'te-frame--focused': isFocused }">
  <div class="tiptap" :class="{ 'tiptap--fullscreen': isFullscreen }">

    <!-- ── Main toolbar ─────────────────────────────────────────────── -->
    <div v-if="editor && editable" class="tiptap__bar" role="toolbar" aria-label="Text editor toolbar">

      <!-- History -->
      <div v-if="features.history" class="tiptap__group" role="group" aria-label="History">
        <button class="tiptap__btn" aria-label="Undo" data-tip="Undo (Ctrl+Z)" :disabled="!editor.can().undo()" @pointerdown.prevent="editor.chain().focus().undo().run(); $emit('onUndo', editor)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>
        </button>
        <button class="tiptap__btn" aria-label="Redo" data-tip="Redo (Ctrl+Y)" :disabled="!editor.can().redo()" @pointerdown.prevent="editor.chain().focus().redo().run(); $emit('onRedo', editor)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/></svg>
        </button>
      </div>
      <span v-if="features.history" class="tiptap__sep" />

      <!-- Headings — custom styled dropdown -->
      <div v-if="features.headings" class="tiptap__dropdown-wrap" @keydown="onHeadingKeydown">
        <button
          ref="headingTriggerRef"
          class="tiptap__btn tiptap__btn--heading-sel"
          :class="{ 'tiptap__btn--on': activeHeading !== '' }"
          aria-label="Text style"
          aria-haspopup="menu"
          :aria-expanded="showHeadingMenu"
          @pointerdown.prevent="showHeadingMenu = !showHeadingMenu; showAlignMenu = false; showListMenu = false"
        >
          <span class="tiptap__heading-label">{{ activeHeadingLabel }}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <template v-if="showHeadingMenu">
          <div class="tiptap__picker-backdrop" @pointerdown.prevent="showHeadingMenu = false" />
          <div ref="headingMenuRef" class="tiptap__dropdown tiptap__dropdown--headings" role="menu">
            <button role="menuitem" tabindex="-1" class="tiptap__heading-item" :class="{ 'tiptap__heading-item--on': activeHeading === '' }" @pointerdown.prevent="editor.chain().focus().setParagraph().run(); showHeadingMenu = false">
              <span class="tiptap__hs tiptap__hs--p">Paragraph</span>
              <svg v-if="activeHeading === ''" class="tiptap__check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            <button role="menuitem" tabindex="-1" class="tiptap__heading-item" :class="{ 'tiptap__heading-item--on': activeHeading === '1' }" @pointerdown.prevent="editor.chain().focus().setHeading({ level: 1 }).run(); showHeadingMenu = false">
              <span class="tiptap__hs tiptap__hs--1">Heading 1</span>
              <svg v-if="activeHeading === '1'" class="tiptap__check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            <button role="menuitem" tabindex="-1" class="tiptap__heading-item" :class="{ 'tiptap__heading-item--on': activeHeading === '2' }" @pointerdown.prevent="editor.chain().focus().setHeading({ level: 2 }).run(); showHeadingMenu = false">
              <span class="tiptap__hs tiptap__hs--2">Heading 2</span>
              <svg v-if="activeHeading === '2'" class="tiptap__check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            <button role="menuitem" tabindex="-1" class="tiptap__heading-item" :class="{ 'tiptap__heading-item--on': activeHeading === '3' }" @pointerdown.prevent="editor.chain().focus().setHeading({ level: 3 }).run(); showHeadingMenu = false">
              <span class="tiptap__hs tiptap__hs--3">Heading 3</span>
              <svg v-if="activeHeading === '3'" class="tiptap__check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            <button role="menuitem" tabindex="-1" class="tiptap__heading-item" :class="{ 'tiptap__heading-item--on': activeHeading === '4' }" @pointerdown.prevent="editor.chain().focus().setHeading({ level: 4 }).run(); showHeadingMenu = false">
              <span class="tiptap__hs tiptap__hs--4">Heading 4</span>
              <svg v-if="activeHeading === '4'" class="tiptap__check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
          </div>
        </template>
      </div>
      <span v-if="features.headings" class="tiptap__sep" />

      <!-- Formatting -->
      <div v-if="features.formatting" class="tiptap__group" role="group" aria-label="Formatting">
        <button class="tiptap__btn tiptap__btn--toggle" :class="{ 'tiptap__btn--on': editor.isActive('bold') }" aria-label="Bold" data-tip="Bold (Ctrl+B)" @pointerdown.prevent="editor.chain().focus().toggleBold().run()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 0 8H6z"/><path d="M6 12h9a4 4 0 0 1 0 8H6z"/></svg>
        </button>
        <button class="tiptap__btn tiptap__btn--toggle" :class="{ 'tiptap__btn--on': editor.isActive('italic') }" aria-label="Italic" data-tip="Italic (Ctrl+I)" @pointerdown.prevent="editor.chain().focus().toggleItalic().run()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
        </button>
        <button class="tiptap__btn tiptap__btn--toggle" :class="{ 'tiptap__btn--on': editor.isActive('underline') }" aria-label="Underline" data-tip="Underline (Ctrl+U)" @pointerdown.prevent="editor.chain().focus().toggleUnderline().run()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
        </button>
      </div>
      <span v-if="features.formatting" class="tiptap__sep" />

      <!-- Alignment dropdown -->
      <div v-if="features.alignment" class="tiptap__dropdown-wrap" @keydown="onAlignKeydown">
        <button
          ref="alignTriggerRef"
          class="tiptap__btn tiptap__btn--caret"
          :class="{ 'tiptap__btn--on': activeAlign !== 'left' }"
          aria-label="Text alignment"
          data-tip="Text alignment"
          aria-haspopup="menu"
          :aria-expanded="showAlignMenu"
          @pointerdown.prevent="showAlignMenu = !showAlignMenu; showListMenu = false; showHeadingMenu = false"
        >
          <svg v-if="activeAlign === 'center'" width="14" height="14" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="5" y1="18" x2="19" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <svg v-else-if="activeAlign === 'right'" width="14" height="14" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="9" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <svg v-else-if="activeAlign === 'justify'" width="14" height="14" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="12" x2="15" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="18" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <template v-if="showAlignMenu">
          <div class="tiptap__picker-backdrop" @pointerdown.prevent="showAlignMenu = false" />
          <div ref="alignMenuRef" class="tiptap__dropdown" role="menu">
            <button role="menuitem" tabindex="-1" class="tiptap__dropdown-item" :class="{ 'tiptap__dropdown-item--on': activeAlign === 'left' }" @pointerdown.prevent="editor.chain().focus().setTextAlign('left').run(); showAlignMenu = false">
              <svg width="14" height="14" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="12" x2="15" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="18" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              Align left
              <svg v-if="activeAlign === 'left'" class="tiptap__check-icon tiptap__check-icon--push" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            <button role="menuitem" tabindex="-1" class="tiptap__dropdown-item" :class="{ 'tiptap__dropdown-item--on': activeAlign === 'center' }" @pointerdown.prevent="editor.chain().focus().setTextAlign('center').run(); showAlignMenu = false">
              <svg width="14" height="14" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="5" y1="18" x2="19" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              Align centre
              <svg v-if="activeAlign === 'center'" class="tiptap__check-icon tiptap__check-icon--push" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            <button role="menuitem" tabindex="-1" class="tiptap__dropdown-item" :class="{ 'tiptap__dropdown-item--on': activeAlign === 'right' }" @pointerdown.prevent="editor.chain().focus().setTextAlign('right').run(); showAlignMenu = false">
              <svg width="14" height="14" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="9" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              Align right
              <svg v-if="activeAlign === 'right'" class="tiptap__check-icon tiptap__check-icon--push" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            <button role="menuitem" tabindex="-1" class="tiptap__dropdown-item" :class="{ 'tiptap__dropdown-item--on': activeAlign === 'justify' }" @pointerdown.prevent="editor.chain().focus().setTextAlign('justify').run(); showAlignMenu = false">
              <svg width="14" height="14" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              Justify
              <svg v-if="activeAlign === 'justify'" class="tiptap__check-icon tiptap__check-icon--push" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
          </div>
        </template>
      </div>
      <span v-if="features.alignment" class="tiptap__sep" />

      <!-- Lists dropdown + indent/outdent -->
      <div v-if="features.lists" class="tiptap__group" role="group" aria-label="Lists">
        <div class="tiptap__dropdown-wrap" @keydown="onListKeydown">
          <button
            ref="listTriggerRef"
            class="tiptap__btn tiptap__btn--caret"
            :class="{ 'tiptap__btn--on': activeList !== null }"
            aria-label="List type"
            data-tip="List type"
            aria-haspopup="menu"
            :aria-expanded="showListMenu"
            @pointerdown.prevent="showListMenu = !showListMenu; showAlignMenu = false; showHeadingMenu = false"
          >
            <svg v-if="activeList === 'ordered'" width="14" height="14" viewBox="0 0 24 24"><line x1="10" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="10" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="10" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4 6h1v4M4 10h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M6 14H4l2-2c.5-.7.5-1.5 0-2H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M4 19h2a1 1 0 0 0 0-2H4v-1h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24"><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/><line x1="8" y1="6" x2="20" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="18" x2="20" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <template v-if="showListMenu">
            <div class="tiptap__picker-backdrop" @pointerdown.prevent="showListMenu = false" />
            <div ref="listMenuRef" class="tiptap__dropdown" role="menu">
              <button role="menuitem" tabindex="-1" class="tiptap__dropdown-item" :class="{ 'tiptap__dropdown-item--on': activeList === 'bullet' }" @pointerdown.prevent="editor.chain().focus().toggleBulletList().run(); showListMenu = false">
                <svg width="14" height="14" viewBox="0 0 24 24"><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/><line x1="8" y1="6" x2="20" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="18" x2="20" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Bullet list
                <svg v-if="activeList === 'bullet'" class="tiptap__check-icon tiptap__check-icon--push" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
              <button role="menuitem" tabindex="-1" class="tiptap__dropdown-item" :class="{ 'tiptap__dropdown-item--on': activeList === 'ordered' }" @pointerdown.prevent="editor.chain().focus().toggleOrderedList().run(); showListMenu = false">
                <svg width="14" height="14" viewBox="0 0 24 24"><line x1="10" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="10" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="10" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4 6h1v4M4 10h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M6 14H4l2-2c.5-.7.5-1.5 0-2H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M4 19h2a1 1 0 0 0 0-2H4v-1h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>
                Numbered list
                <svg v-if="activeList === 'ordered'" class="tiptap__check-icon tiptap__check-icon--push" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
            </div>
          </template>
        </div>

      </div>
      <span v-if="features.lists" class="tiptap__sep" />

      <!-- Links -->
      <div v-if="features.links" class="tiptap__group" role="group" aria-label="Links">
        <button class="tiptap__btn" :class="{ 'tiptap__btn--on': editor.isActive('link') }" aria-label="Insert or edit link" data-tip="Insert / edit link (Ctrl+K)" @pointerdown.prevent="openLinkDialog">
          <svg width="15" height="15" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <span v-if="features.links" class="tiptap__sep" />

      <!-- Clipboard: copy + cut -->
      <div v-if="features.clipboard" class="tiptap__group" role="group" aria-label="Clipboard">
        <button class="tiptap__btn" aria-label="Copy selection" data-tip="Copy (Ctrl+C)" @pointerdown.prevent="copySelection">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
        <button class="tiptap__btn" aria-label="Cut selection" data-tip="Cut (Ctrl+X)" @pointerdown.prevent="cutSelection">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="20" r="3"/><circle cx="6" cy="4" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
        </button>
        <button class="tiptap__btn" aria-label="Paste" data-tip="Paste (Ctrl+V)" @pointerdown.prevent="pasteContent">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
        </button>
      </div>
      <span v-if="features.clipboard" class="tiptap__sep" />

      <!-- Table picker -->
      <div v-if="features.tables" class="tiptap__group tiptap__table-picker-wrap">
        <button class="tiptap__btn" :class="{ 'tiptap__btn--on': showTablePicker }" aria-label="Insert table" data-tip="Insert table" @pointerdown.prevent="showTablePicker = !showTablePicker">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="18" rx="1.5"/>
            <path d="M2 8h20"/><path d="M2 14h20"/>
            <path d="M8 8v13"/><path d="M16 8v13"/>
          </svg>
        </button>
        <template v-if="showTablePicker">
          <div class="tiptap__picker-backdrop" @pointerdown.prevent="showTablePicker = false" />
          <div class="tiptap__table-picker">
            <div class="tiptap__table-picker-label">{{ pickerCols && pickerRows ? `${pickerCols} \xd7 ${pickerRows}` : 'Insert table' }}</div>
            <div class="tiptap__table-picker-grid" @mouseleave="pickerRows = 0; pickerCols = 0">
              <div v-for="row in 8" :key="row" class="tiptap__table-picker-row">
                <div v-for="col in 10" :key="col" class="tiptap__table-picker-cell" :class="{ 'tiptap__table-picker-cell--active': row <= pickerRows && col <= pickerCols }" @mouseenter="pickerRows = row; pickerCols = col" @pointerdown.prevent="doInsertTable(row, col)" />
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Custom toolbar slot -->
      <template v-if="$slots['toolbar-actions']">
        <span class="tiptap__sep" />
        <slot name="toolbar-actions" :editor="editor" />
      </template>

      <!-- Fullscreen pushed right -->
      <span class="tiptap__spacer" />
      <div v-if="features.fullscreen" class="tiptap__group">
        <button class="tiptap__btn tiptap__btn--toggle" :class="{ 'tiptap__btn--on': isFullscreen }" :aria-label="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'" :data-tip="isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'" @pointerdown.prevent="isFullscreen = !isFullscreen">
          <svg v-if="!isFullscreen" width="15" height="15" viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="9 21 3 21 3 15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="21" y1="3" x2="14" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="21" x2="10" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24"><polyline points="4 14 10 14 10 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="20 10 14 10 14 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="10" y1="14" x2="3" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="21" y1="3" x2="14" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>

    <!-- ── Inline link popup ─────────────────────────────────────────── -->
    <BubbleMenu
      v-if="editor && editable && features.links"
      :editor="editor"
      :tippy-options="{ theme: 'tiptap-bubble', placement: 'bottom', offset: [0, 6], zIndex: 60 }"
      :should-show="({ editor }) => editor.isActive('link') && !showLinkDialog"
      class="tiptap__link-bubble"
    >
      <a class="tiptap__link-bubble-url" :href="activeLinkUrl" target="_blank" rel="noopener noreferrer" @mousedown.stop>{{ truncatedLinkUrl }}</a>
      <span class="tiptap__sep" />
      <button class="tiptap__btn" aria-label="Edit link" @mouseenter="showBubbleTip($event, 'Edit link')" @mouseleave="hideBubbleTip" @pointerdown.prevent="clearBubbleTip(); openLinkDialog()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
      </button>
      <button class="tiptap__btn" aria-label="Remove link" @mouseenter="showBubbleTip($event, 'Remove link')" @mouseleave="hideBubbleTip" @pointerdown.prevent="clearBubbleTip(); editor.chain().focus().unsetLink().run()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
      </button>
    </BubbleMenu>

    <!-- ── Floating table toolbar ────────────────────────────────────── -->
    <BubbleMenu
      v-if="editor && editable && features.tables"
      :editor="editor"
      :tippy-options="{ theme: 'tiptap-bubble', duration: 100, placement: 'bottom', offset: [0, 12], zIndex: 50 }"
      :should-show="tableIsActive"
      class="tiptap__table-bubble"
    >
      <div class="tiptap__group">
        <button class="tiptap__btn" aria-label="Add row above" @mouseenter="showBubbleTip($event, 'Add row above')" @mouseleave="hideBubbleTip" @pointerdown.prevent="clearBubbleTip(); editor.chain().focus().addRowBefore().run()">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="1"/><line x1="3" y1="16" x2="21" y2="16"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="12" y1="3" x2="12" y2="9"/><polyline points="9 6 12 3 15 6"/></svg>
        </button>
        <button class="tiptap__btn" aria-label="Add row below" @mouseenter="showBubbleTip($event, 'Add row below')" @mouseleave="hideBubbleTip" @pointerdown.prevent="clearBubbleTip(); editor.chain().focus().addRowAfter().run()">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="10" rx="1"/><line x1="3" y1="8" x2="21" y2="8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="12" y1="15" x2="12" y2="21"/><polyline points="9 18 12 21 15 18"/></svg>
        </button>
        <button class="tiptap__btn tiptap__btn--danger" aria-label="Delete row" @mouseenter="showBubbleTip($event, 'Delete row')" @mouseleave="hideBubbleTip" @pointerdown.prevent="clearBubbleTip(); editor.chain().focus().deleteRow().run()">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="11.5" x2="15" y2="13.5"/><line x1="15" y1="11.5" x2="9" y2="13.5"/></svg>
        </button>
      </div>
      <span class="tiptap__sep" />
      <div class="tiptap__group">
        <button class="tiptap__btn" aria-label="Add column before" @mouseenter="showBubbleTip($event, 'Add column before')" @mouseleave="hideBubbleTip" @pointerdown.prevent="clearBubbleTip(); editor.chain().focus().addColumnBefore().run()">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="11" y="3" width="10" height="18" rx="1"/><line x1="16" y1="3" x2="16" y2="21"/><line x1="11" y1="12" x2="5" y2="12"/><line x1="3" y1="8" x2="3" y2="16"/><polyline points="6 9 3 12 6 15"/></svg>
        </button>
        <button class="tiptap__btn" aria-label="Add column after" @mouseenter="showBubbleTip($event, 'Add column after')" @mouseleave="hideBubbleTip" @pointerdown.prevent="clearBubbleTip(); editor.chain().focus().addColumnAfter().run()">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="10" height="18" rx="1"/><line x1="8" y1="3" x2="8" y2="21"/><line x1="13" y1="12" x2="19" y2="12"/><line x1="21" y1="8" x2="21" y2="16"/><polyline points="18 9 21 12 18 15"/></svg>
        </button>
        <button class="tiptap__btn tiptap__btn--danger" aria-label="Delete column" @mouseenter="showBubbleTip($event, 'Delete column')" @mouseleave="hideBubbleTip" @pointerdown.prevent="clearBubbleTip(); editor.chain().focus().deleteColumn().run()">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="11" y1="9" x2="13" y2="15"/><line x1="13" y1="9" x2="11" y2="15"/></svg>
        </button>
      </div>
      <span class="tiptap__sep" />
      <button class="tiptap__btn tiptap__btn--danger" aria-label="Delete table" @mouseenter="showBubbleTip($event, 'Delete table')" @mouseleave="hideBubbleTip" @pointerdown.prevent="clearBubbleTip(); editor.chain().focus().deleteTable().run()">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
      </button>
    </BubbleMenu>

    <!-- ── Link dialog ───────────────────────────────────────────────── -->
    <div v-if="showLinkDialog" class="tiptap__overlay" @pointerdown.self.prevent="showLinkDialog = false">
      <div class="tiptap__dialog" role="dialog" aria-modal="true" aria-label="Insert link">
        <p class="tiptap__dialog-title">Insert link</p>
        <label class="tiptap__dialog-label" for="te-link-text">Display text</label>
        <input id="te-link-text" ref="linkTextInput" v-model="linkText" type="text" class="tiptap__dialog-input" placeholder="Link text (optional)" @keydown.esc.prevent="showLinkDialog = false" />
        <label class="tiptap__dialog-label" for="te-link-url" style="margin-top:10px;">URL</label>
        <input id="te-link-url" ref="linkInput" v-model="linkUrl" type="url" class="tiptap__dialog-input" placeholder="https://example.com" @keydown.enter.prevent="applyLink" @keydown.esc.prevent="showLinkDialog = false" />
        <label class="tiptap__dialog-check">
          <input id="te-link-target" v-model="linkNewTab" type="checkbox" />
          <span>Open in new tab</span>
        </label>
        <div class="tiptap__dialog-actions">
          <button class="tiptap__dialog-btn tiptap__dialog-btn--primary" @pointerdown.prevent="applyLink">Apply</button>
          <button class="tiptap__dialog-btn" @pointerdown.prevent="showLinkDialog = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- ── Editor content ────────────────────────────────────────────── -->
    <div class="tiptap__content-wrap">
      <div v-if="isEmpty && placeholder" class="tiptap__placeholder">{{ placeholder }}</div>
      <editor-content :editor="editor" class="tiptap__body" :style="{ minHeight: height + 'px' }" />
    </div>

    <!-- ── Status bar ────────────────────────────────────────────────── -->
    <div v-if="editor" class="tiptap__statusbar">
      <span>{{ wordCount.words }} word{{ wordCount.words !== 1 ? 's' : '' }}</span>
      <span class="tiptap__statusbar-sep" />
      <span>{{ wordCount.chars }} character{{ wordCount.chars !== 1 ? 's' : '' }}</span>
      <span class="tiptap__spacer" />
      <a href="https://www.angelsolutions.co.uk/" target="_blank" rel="noopener noreferrer" class="tiptap__statusbar-logo" aria-label="Angel Solutions" data-tip-up="Made with ♥ by Angel Solutions">
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="35" fill="none" viewBox="0 0 40 35"><path fill="#B0B0BC" d="M22.102 34.318a20.052 20.052 0 0 1-15.714-5.245A19.967 19.967 0 0 1 .015 15.19c-.158-4.356.912-7.907 3.46-11.51l.218-.298c0 .376.017.877.067 1.353.205 1.964.771 3.189 1.433 4.61.138.3.28.607.423.936.537 1.218 1.091 2.476 1.194 3.84.039.902.009 1.806-.089 2.704a20.99 20.99 0 0 0-.102 2.283 11.872 11.872 0 0 0 3.786 8.262 11.922 11.922 0 0 0 8.53 3.177c.272 0 .547-.028.819-.06 6.19-.645 10.723-6.362 10.508-12.573.015-.927.095-1.851.239-2.767.315-1.472.991-2.86 1.645-4.192 1.154-2.354 1.421-4.668.9-8.05A10.7 10.7 0 0 1 32.924 0l.601.658c3.545 3.641 6.289 8.224 6.465 13.107a19.993 19.993 0 0 1-4.904 13.777 20.074 20.074 0 0 1-12.983 6.776ZM3.155 5.768l-.277.528a17.913 17.913 0 0 0-1.842 8.859A18.946 18.946 0 0 0 7.083 28.33a19.027 19.027 0 0 0 14.911 4.975 19.036 19.036 0 0 0 12.327-6.43 18.958 18.958 0 0 0 4.646-13.084c-.14-3.963-2.357-7.983-4.776-11.12l-.636-.743.294.917c1.025 3.41.45 5.985-.807 8.551-.657 1.344-1.278 2.622-1.564 3.961a18.41 18.41 0 0 0-.206 2.517c.24 6.744-4.693 12.924-11.415 13.627a12.949 12.949 0 0 1-10.151-3.385 12.893 12.893 0 0 1-4.114-8.97c-.009-.795.027-1.591.107-2.383.09-.845.12-1.696.088-2.545-.097-1.192-.594-2.321-1.117-3.513-.112-.252-.239-.503-.347-.753-.499-1.072-1.02-2.18-1.077-3.575l-.09-.61Z"/><path fill="#B0B0BC" d="M35.17 13.616a.452.452 0 0 1-.4-.654.45.45 0 0 1 .216-.207c3.093-1.385 3.14-3.08 3.14-3.098a.45.45 0 0 1 .44-.46.461.461 0 0 1 .46.438c0 .093.013 2.288-3.67 3.938a.438.438 0 0 1-.186.04v.003ZM35.053 17.448a.451.451 0 0 1-.082-.892c3.139-.589 4.025-2.972 4.06-3.067a.451.451 0 0 1 .853.3c-.043.12-1.077 2.967-4.745 3.652a.507.507 0 0 1-.084 0l-.002.007ZM34.78 21.372a.452.452 0 0 1-.318-.768.452.452 0 0 1 .319-.132c3.37-.034 3.94-2.872 3.964-2.992a.45.45 0 0 1 .886.165c0 .038-.738 3.685-4.84 3.727h-.01ZM3.215 14.207a.46.46 0 0 1-.274-.093C.617 12.33.498 10.388.495 10.3a.45.45 0 0 1 .745-.34.45.45 0 0 1 .156.295c0 .069.126 1.628 2.096 3.139a.45.45 0 0 1-.277.805v.008ZM2.702 16.73a.456.456 0 0 1-.184-.038C-.085 15.534.088 13.32.096 13.227a.45.45 0 0 1 .796-.25.45.45 0 0 1 .104.328c0 .077-.102 1.669 1.89 2.565a.45.45 0 0 1-.184.86ZM2.232 19.557a.476.476 0 0 1-.082-.015C.211 19.194.066 16.353.058 16.234a.45.45 0 0 1 .898-.028c0 .024.136 2.247 1.352 2.471a.45.45 0 0 1 .233.78.45.45 0 0 1-.314.112l.005-.012ZM33.751 25.436h-.107a.452.452 0 0 1-.32-.77.452.452 0 0 1 .32-.131c3.32.043 3.79-2.383 3.809-2.481a.451.451 0 0 1 .89.152c0 .031-.594 3.23-4.606 3.23h.014ZM16.367 28.264h-.081l-.081-.019-.079-.019-.079-.024a2.44 2.44 0 0 1-1.115-.736 3.761 3.761 0 0 1-.729-1.301 5.618 5.618 0 0 1-.286-1.685 7.036 7.036 0 0 1 .222-1.885c.143-.576.361-1.13.65-1.65.254-.463.576-.886.955-1.255a3.639 3.639 0 0 1 1.151-.763c.388-.16.811-.216 1.227-.164l.082.014.079.014.08.02.08.02c.433.13.822.377 1.122.716.33.38.58.824.736 1.303.181.547.28 1.118.291 1.695a7.084 7.084 0 0 1-.222 1.906 6.915 6.915 0 0 1-.662 1.668 5.262 5.262 0 0 1-.955 1.254 3.568 3.568 0 0 1-1.16.748c-.389.157-.811.208-1.226.15m1.894-10.528a3.269 3.269 0 0 0-1.564.188 4.523 4.523 0 0 0-1.45.896 6.283 6.283 0 0 0-1.194 1.504 7.837 7.837 0 0 0-.8 1.983 8.015 8.015 0 0 0-.239 2.287c.023.7.156 1.393.394 2.052.21.59.534 1.133.955 1.597.388.428.882.747 1.433.922l.11.031.108.026.11.024.107.02a3.225 3.225 0 0 0 1.564-.165c.54-.2 1.035-.503 1.46-.891.48-.437.89-.945 1.213-1.507a7.736 7.736 0 0 0 .814-1.994c.196-.755.28-1.535.249-2.314a6.665 6.665 0 0 0-.406-2.071 4.703 4.703 0 0 0-.973-1.6 3.277 3.277 0 0 0-1.454-.907l-.11-.029-.107-.026-.11-.02-.11-.018M21.27 16.332c-.162-.024-.327-.048-.494-.079-.167-.03-.34-.061-.514-.1a16.696 16.696 0 0 1-1.077-.271 15.023 15.023 0 0 1-1.55-.534 10.638 10.638 0 0 1-1.141-.541 6.585 6.585 0 0 1-.767-.491 2.594 2.594 0 0 1-.418-.382l-.148-.174.21-.073c.108-.037.22-.063.332-.08a6.266 6.266 0 0 1 1.106-.045c.239 0 .492.034.771.07a13.974 13.974 0 0 1 1.534.295c.179.043.36.093.542.146.529.15 1.05.326 1.56.531.398.162.786.346 1.162.553.274.148.538.315.789.498.154.113.297.241.425.384l.15.179-.215.074c-.11.035-.222.06-.337.076-.163.024-.327.04-.492.045h-.64c-.236 0-.496-.038-.78-.074m-3.604-3.708a11.372 11.372 0 0 0-1.078-.086 5.482 5.482 0 0 0-1.026.067c-.29.044-.568.145-.817.298-.221.14-.38.359-.444.612a1.229 1.229 0 0 0 .293 1.073c.328.383.721.706 1.161.953.51.302 1.044.564 1.595.784a16.537 16.537 0 0 0 3.27.944c.181.03.36.06.535.083l.358.043c.12.012.239.024.346.031.108.007.223.015.33.02h.315c.277 0 .553-.024.826-.07.218-.032.43-.095.631-.186.162-.07.307-.173.427-.302a.976.976 0 0 0 .225-.422 1.23 1.23 0 0 0-.303-1.087 4.431 4.431 0 0 0-1.194-.968 11.677 11.677 0 0 0-1.617-.784 16.225 16.225 0 0 0-1.596-.548l-.277-.074c-.136-.033-.308-.079-.508-.124-.201-.045-.433-.093-.679-.138-.246-.045-.508-.09-.773-.12Z"/></svg>
      </a>
    </div>
  </div>
  </div>
  </div>
</template>

<script>
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { watch, ref, nextTick, computed, onMounted, onUnmounted } from 'vue';

const DEFAULT_FEATURES = {
  history:   true,
  headings:  true,
  formatting: true,
  alignment: true,
  lists:     true,
  links:     true,
  clipboard: true,
  tables:    true,
  fullscreen: true,
};

// Strip dangerous protocols and event-handler attributes from pasted HTML
function sanitizePastedHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  div.querySelectorAll('*').forEach((el) => {
    [...el.attributes].forEach((attr) => {
      if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
      if (['href', 'src', 'action'].includes(attr.name) &&
          /^(javascript|data|vbscript):/i.test(attr.value)) {
        el.removeAttribute(attr.name);
      }
    });
    if (['SCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'FORM'].includes(el.tagName)) el.remove();
  });
  return div.innerHTML;
}

// Ensure a URL is safe before storing it
function sanitizeUrl(raw) {
  const url = raw.trim();
  if (!url) return '';
  if (/^(javascript|data|vbscript):/i.test(url)) return '';
  // Prefix bare domains with https://
  if (!/^[a-z][a-z\d+\-.]*:\/\//i.test(url) && !/^mailto:/i.test(url) && !/^tel:/i.test(url) && !/^#/.test(url)) {
    return 'https://' + url;
  }
  return url;
}

// Reusable keyboard-nav for ARIA menus
function useMenuKeyNav(menuRef, triggerRef, showRef) {
  const getItems = () => [...(menuRef.value?.querySelectorAll('[role="menuitem"]') ?? [])];

  watch(showRef, (val) => {
    if (val) {
      nextTick(() => {
        const items = getItems();
        const active = items.find((i) => i.getAttribute('aria-checked') === 'true' || i.classList.contains('tiptap__dropdown-item--on') || i.classList.contains('tiptap__heading-item--on'));
        (active ?? items[0])?.focus();
      });
    }
  });

  const onKeydown = (e) => {
    if (!showRef.value) return;
    const items = getItems();
    if (!items.length) return;
    const idx = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(idx + 1) % items.length]?.focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(idx - 1 + items.length) % items.length]?.focus(); }
    else if (e.key === 'Home') { e.preventDefault(); items[0]?.focus(); }
    else if (e.key === 'End')  { e.preventDefault(); items[items.length - 1]?.focus(); }
    else if (e.key === 'Escape') {
      e.preventDefault();
      showRef.value = false;
      nextTick(() => triggerRef.value?.focus());
    }
  };

  return { onKeydown };
}

export default {
  name: 'TiptapEditor',
  components: { EditorContent, BubbleMenu },

  props: {
    modelValue:  { type: String,  default: '' },
    height:      { type: Number,  default: 250 },
    editable:    { type: Boolean, default: true },
    placeholder: { type: String,  default: '' },
    features:    { type: Object,  default: () => ({}) },
  },

  emits: [
    'update:modelValue',
    'onChange',        // content changed
    'onFocus',         // editor gained focus
    'onBlur',          // editor lost focus
    'onReady',         // editor instance ready (equiv. TinyMCE init_instance_callback)
    'onKeyDown',       // keydown inside editor — payload: KeyboardEvent
    'onKeyUp',         // keyup inside editor — payload: KeyboardEvent
    'onSelectionChange', // selection/cursor moved — payload: editor instance
    'onNodeChange',    // selection changed (alias matching TinyMCE) — payload: editor instance
    'onClick',         // editor content clicked — payload: MouseEvent
    'onPaste',         // content pasted — payload: ClipboardEvent
    'onUndo',          // undo performed — payload: editor instance
    'onRedo',          // redo performed — payload: editor instance
  ],

  setup(props, { emit }) {
    const isFullscreen     = ref(false);
    const isFocused        = ref(false);
    const showLinkDialog   = ref(false);
    const linkUrl          = ref('');
    const linkText         = ref('');
    const linkNewTab       = ref(false);
    const linkInput        = ref(null);
    const linkTextInput    = ref(null);
    const tableIsActive    = ({ editor }) => editor.isActive('table');
    const showTablePicker  = ref(false);
    const pickerRows       = ref(0);
    const pickerCols       = ref(0);
    const wordCount        = ref({ words: 0, chars: 0 });
    const showAlignMenu    = ref(false);
    const showListMenu     = ref(false);
    const showHeadingMenu  = ref(false);
    const bubbleTip        = ref({ visible: false, text: '', x: 0, y: 0 });

    // Refs for keyboard-nav DOM nodes
    const headingMenuRef  = ref(null);
    const headingTriggerRef = ref(null);
    const alignMenuRef    = ref(null);
    const alignTriggerRef = ref(null);
    const listMenuRef     = ref(null);
    const listTriggerRef  = ref(null);

    const { onKeydown: onHeadingKeydown } = useMenuKeyNav(headingMenuRef, headingTriggerRef, showHeadingMenu);
    const { onKeydown: onAlignKeydown   } = useMenuKeyNav(alignMenuRef,   alignTriggerRef,   showAlignMenu);
    const { onKeydown: onListKeydown    } = useMenuKeyNav(listMenuRef,    listTriggerRef,    showListMenu);

    const updateWordCount = (ed) => {
      const text = ed.getText();
      wordCount.value = {
        words: text.trim() ? text.trim().split(/\s+/).length : 0,
        chars: text.length,
      };
    };

    const features = computed(() => ({ ...DEFAULT_FEATURES, ...props.features }));

    const editor = useEditor({
      content:  props.modelValue,
      editable: props.editable,
      editorProps: {
        attributes: { class: 'tiptap__prosemirror' },
        transformPastedHTML: sanitizePastedHTML,
        handleKeyDown: (_view, event) => { emit('onKeyDown', event); return false; },
        handleKeyUp:   (_view, event) => { emit('onKeyUp',   event); return false; },
        handleClick:   (_view, _pos, event) => { emit('onClick', event); return false; },
        handlePaste:   (_view, event) => { emit('onPaste', event); return false; },
      },
      extensions: [
        StarterKit,
        Underline,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Link.extend({
          addAttributes() {
            return {
              ...this.parent?.(),
              target: {
                default: null,
                parseHTML: (el) => el.getAttribute('target'),
                renderHTML: (attrs) => attrs.target ? { target: attrs.target } : {},
              },
              rel: {
                default: null,
                parseHTML: (el) => el.getAttribute('rel'),
                renderHTML: (attrs) => attrs.rel ? { rel: attrs.rel } : {},
              },
            };
          },
        }).configure({ openOnClick: false, HTMLAttributes: {} }),
        Table.configure({ resizable: false }),
        TableRow,
        TableHeader,
        TableCell,
      ],
      onCreate: ({ editor }) => { updateWordCount(editor); emit('onReady', editor); },
      onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML());
        emit('onChange');
        updateWordCount(editor);
      },
      onFocus: () => { isFocused.value = true;  emit('onFocus'); },
      onBlur:  () => { isFocused.value = false; emit('onBlur');  },
      onSelectionUpdate: ({ editor }) => {
        emit('onSelectionChange', editor);
        emit('onNodeChange', editor);
      },
    });

    watch(() => props.modelValue, (val) => {
      if (editor.value && editor.value.getHTML() !== val) {
        editor.value.commands.setContent(val || '', false);
      }
    });
    watch(() => props.editable, (val) => editor.value?.setEditable(val));

    const isEmpty = computed(() => !editor.value || editor.value.isEmpty);

    const activeHeading = computed(() => {
      if (!editor.value) return '';
      for (let i = 1; i <= 4; i++) {
        if (editor.value.isActive('heading', { level: i })) return String(i);
      }
      return '';
    });
    const activeHeadingLabel = computed(() => activeHeading.value ? `Heading ${activeHeading.value}` : 'Paragraph');

    const activeAlign = computed(() => {
      if (!editor.value) return 'left';
      if (editor.value.isActive({ textAlign: 'center' }))  return 'center';
      if (editor.value.isActive({ textAlign: 'right' }))   return 'right';
      if (editor.value.isActive({ textAlign: 'justify' })) return 'justify';
      return 'left';
    });

    const activeList = computed(() => {
      if (!editor.value) return null;
      if (editor.value.isActive('bulletList'))  return 'bullet';
      if (editor.value.isActive('orderedList')) return 'ordered';
      return null;
    });

const activeLinkUrl = computed(() => editor.value?.getAttributes('link').href || '');
    const truncatedLinkUrl = computed(() => {
      const url = activeLinkUrl.value;
      if (!url) return '';
      try {
        const u = new URL(url);
        const d = u.hostname + (u.pathname === '/' ? '' : u.pathname);
        return d.length > 36 ? d.slice(0, 33) + '…' : d;
      } catch { return url.length > 36 ? url.slice(0, 33) + '…' : url; }
    });

    const doInsertTable = (rows, cols) => {
      editor.value?.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
      showTablePicker.value = false;
      pickerRows.value = 0;
      pickerCols.value = 0;
    };

    const openLinkDialog = () => {
      clearBubbleTip();
      if (editor.value.isActive('link')) editor.value.chain().extendMarkRange('link').run();
      const { from, to } = editor.value.state.selection;
      const attrs = editor.value?.getAttributes('link');
      linkUrl.value    = attrs.href || '';
      linkText.value   = editor.value.state.doc.textBetween(from, to, ' ');
      linkNewTab.value = attrs.target === '_blank';
      showLinkDialog.value = true;
      nextTick(() => linkTextInput.value?.focus());
    };

    const applyLink = () => {
      const url  = sanitizeUrl(linkUrl.value);
      const text = linkText.value.trim();
      // Only allow safe, whitelisted target values — never trust user input directly
      const target = linkNewTab.value ? '_blank' : null;
      const rel    = linkNewTab.value ? 'noopener noreferrer' : null;
      if (url) {
        if (text) {
          editor.value?.chain().focus()
            .extendMarkRange('link').deleteSelection()
            .insertContent({ type: 'text', text, marks: [{ type: 'link', attrs: { href: url, target, rel } }] })
            .run();
        } else {
          editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url, target, rel }).run();
        }
      }
      showLinkDialog.value = false;
      linkUrl.value    = '';
      linkText.value   = '';
      linkNewTab.value = false;
    };

    // Clipboard helpers — paste is always Ctrl+V (browser security)
    const copySelection = async () => {
      if (!editor.value) return;
      const { from, to } = editor.value.state.selection;
      if (from === to) return;
      const text = editor.value.state.doc.textBetween(from, to, '\n');
      await navigator.clipboard.writeText(text).catch(() => {});
    };
    const cutSelection = async () => {
      if (!editor.value) return;
      const { from, to } = editor.value.state.selection;
      if (from === to) return;
      const text = editor.value.state.doc.textBetween(from, to, '\n');
      await navigator.clipboard.writeText(text).catch(() => {});
      editor.value.chain().focus().deleteSelection().run();
    };
    const pasteContent = async () => {
      if (!editor.value) return;
      try {
        const text = await navigator.clipboard.readText();
        if (text) editor.value.chain().focus().insertContent(text).run();
      } catch {
        // Permission denied or API unavailable — focus editor so Ctrl+V still works
        editor.value.commands.focus();
      }
    };

    const showBubbleTip = (e, text) => {
      const r = e.currentTarget.getBoundingClientRect();
      bubbleTip.value = { visible: true, text, x: r.left + r.width / 2, y: r.top - 6 };
    };
    const hideBubbleTip = () => { bubbleTip.value = { ...bubbleTip.value, visible: false }; };
    // Ensure tooltip is always cleared when any action closes the bubble
    const clearBubbleTip = () => { bubbleTip.value = { visible: false, text: '', x: 0, y: 0 }; };

    const onKeydown = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (e.key === 'Escape') {
        if (isFullscreen.value)   { isFullscreen.value = false;   e.preventDefault(); }
        if (showTablePicker.value) { showTablePicker.value = false; }
        if (showHeadingMenu.value) { showHeadingMenu.value = false; }
      }
      // Ctrl+K — open link dialog (only when editor is focused)
      if (mod && e.key === 'k' && isFocused.value) {
        e.preventDefault();
        if (features.value.links) openLinkDialog();
      }
    };
    onMounted(() => document.addEventListener('keydown', onKeydown));
    onUnmounted(() => document.removeEventListener('keydown', onKeydown));

    return {
      editor, isFullscreen, isFocused, showLinkDialog,
      linkUrl, linkText, linkNewTab, linkInput, linkTextInput,
      showTablePicker, pickerRows, pickerCols, wordCount,
      showAlignMenu, showListMenu, showHeadingMenu,
      headingMenuRef, headingTriggerRef,
      alignMenuRef, alignTriggerRef,
      listMenuRef, listTriggerRef,
      onHeadingKeydown, onAlignKeydown, onListKeydown,
      bubbleTip, showBubbleTip, hideBubbleTip, clearBubbleTip,
      features, isEmpty,
      activeHeading, activeHeadingLabel, activeAlign, activeList,
      activeLinkUrl, truncatedLinkUrl, tableIsActive,
      doInsertTable, openLinkDialog, applyLink,
      copySelection, cutSelection, pasteContent,
    };
  },
};
</script>

<style>
.tiptap-root {
  --te-accent:        #6366f1;
  --te-accent-dark:   #4f46e5;
  --te-accent-bg:     #ede9fe;
  --te-accent-bg2:    #ddd6fe;
  --te-accent-ring:   rgba(99, 102, 241, 0.12);
  --te-accent-cell:   rgba(99, 102, 241, 0.06);
  --te-accent-border: rgba(99, 102, 241, 0.25);
  --te-border:        #b4b4c2;
  --te-border-light:  #d0d0da;
}

.tiptap-root {
  isolation: isolate;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #1a1a2e;
}
.tiptap-root *, .tiptap-root *::before, .tiptap-root *::after { box-sizing: border-box; }
.tiptap-root button {
  -webkit-appearance: none; appearance: none;
  background: none; border: none; border-radius: 0;
  cursor: pointer; font: inherit; margin: 0; padding: 0;
}
.tiptap-root input, .tiptap-root select {
  -webkit-appearance: none; appearance: none; font: inherit; margin: 0;
}

/* ── Frame — owns the border, radius and focus ring ────────────────── */
.te-frame {
  border: 1px solid var(--te-border);
  border-radius: 8px;
  background: #fff;
  position: relative;
  transition: border-color 150ms, box-shadow 150ms;
}
.te-frame--fullscreen {
  position: fixed; inset: 0; z-index: 9999;
  border-radius: 0; border: none;
}
.te-frame--focused {
  border-color: var(--te-accent);
  box-shadow: 0 0 0 3px var(--te-accent-ring);
}

/* ── Inner tiptap wrapper — layout only, no visual border ──────────── */
.tiptap {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.tiptap--fullscreen .tiptap__content-wrap { flex: 1; overflow-y: auto; }

/* ── Toolbar ───────────────────────────────────────────────────────── */
.tiptap__bar {
  display: flex; flex-wrap: wrap; align-items: center;
  gap: 2px; padding: 6px 8px;
  border-bottom: 1px solid var(--te-border-light);
  background: #fafafa;
  border-radius: 8px 8px 0 0;
  min-height: 46px;
  position: relative; z-index: 1;
}
.tiptap__group { display: flex; align-items: center; gap: 2px; }
.tiptap__sep {
  display: inline-block; width: 1px; height: 18px;
  background: var(--te-border-light); margin: 0 5px;
  flex-shrink: 0; align-self: center;
}
.tiptap__spacer { flex: 1; }

/* ── Toolbar buttons ───────────────────────────────────────────────── */
.tiptap__btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; padding: 0;
  border-radius: 5px; background: transparent;
  cursor: pointer; color: #8c8c9a;
  transition: background 100ms, color 100ms; flex-shrink: 0;
}
.tiptap__btn:hover:not(:disabled) { background: #f0f0f4; color: #111827; }
.tiptap-root .tiptap__btn--toggle.tiptap__btn--on { background: #e4e4ea; color: #374151; border-radius: 6px; }
.tiptap-root .tiptap__btn--toggle.tiptap__btn--on:hover:not(:disabled) { background: #d6d6de; color: #111827; }
.tiptap__btn:disabled { opacity: 0.3; cursor: not-allowed; }
.tiptap__btn--danger:hover:not(:disabled) { background: #fff0f0; color: #dc2626; }
.tiptap__btn svg { display: block; flex-shrink: 0; }

/* ── Heading selector ──────────────────────────────────────────────── */
.tiptap__btn--heading-sel {
  width: auto; padding: 0 6px 0 8px; gap: 4px;
  min-width: 100px; justify-content: space-between; height: 34px;
}
.tiptap__heading-label {
  font-size: 12.5px; font-weight: 500; color: inherit;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.tiptap__dropdown--headings { min-width: 190px; padding: 4px; }
.tiptap__heading-item {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; padding: 7px 10px; border-radius: 5px;
  cursor: pointer; background: none; border: none;
  text-align: left; transition: background 80ms; color: #374151;
}
.tiptap__heading-item:hover { background: #f0f0f4; }
.tiptap__heading-item--on { background: var(--te-accent-bg); }
.tiptap__heading-item--on:hover { background: var(--te-accent-bg2); }

.tiptap__hs { display: block; line-height: 1.2; }
.tiptap__hs--p { font-size: 13px;  font-weight: 400; color: #374151; padding: 4px 0; }
.tiptap__hs--1 { font-size: 22px;  font-weight: 700; color: #111827; padding: 2px 0; }
.tiptap__hs--2 { font-size: 17px;  font-weight: 700; color: #111827; padding: 2px 0; }
.tiptap__hs--3 { font-size: 15px;  font-weight: 600; color: #111827; padding: 2px 0; }
.tiptap__hs--4 { font-size: 13.5px; font-weight: 600; color: #374151; padding: 2px 0; }

.tiptap__check-icon { flex-shrink: 0; color: var(--te-accent); }
.tiptap__check-icon--push { margin-left: auto; }

/* ── Caret / dropdown-wrap ─────────────────────────────────────────── */
.tiptap__dropdown-wrap { position: relative; display: inline-flex; align-items: center; }
.tiptap__btn--caret { width: auto; padding: 0 5px; gap: 3px; }

.tiptap__dropdown {
  position: absolute; top: calc(100% + 5px); left: 0; z-index: 100;
  background: #fff; border: 1px solid var(--te-border);
  border-radius: 7px; padding: 3px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.05);
  min-width: 140px;
  animation: tiptap-slide-down 0.1s ease;
}
.tiptap-root .tiptap__dropdown-item {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 6px 9px; border-radius: 4px;
  font-size: 13px; color: #374151; cursor: pointer;
  background: none; border: none; text-align: left; transition: background 80ms;
}
.tiptap-root .tiptap__dropdown-item:hover { background: #f0f0f4; color: #111827; }
.tiptap-root .tiptap__dropdown-item--on { background: var(--te-accent-bg); color: var(--te-accent); }
.tiptap-root .tiptap__dropdown-item--on:hover { background: var(--te-accent-bg2); }

/* ── Content area ──────────────────────────────────────────────────── */
.tiptap__content-wrap { position: relative; flex: 1; display: flex; flex-direction: column; }
.tiptap__placeholder {
  position: absolute; top: 14px; left: 18px; right: 18px;
  color: #c4c4cc; font-size: 14px; line-height: 1.6;
  pointer-events: none; user-select: none;
}
.tiptap__body {
  padding: 0; cursor: text; background: #fff;
  flex: 1;
}
.tiptap__prosemirror { outline: none; min-height: inherit; line-height: 1.65; color: #1f2937; padding: 14px 18px; }

/* Typography */
.tiptap__prosemirror > * + * { margin-top: 0.55em; }
.tiptap__prosemirror p { margin: 0 0 0.4em; }
.tiptap__prosemirror p:last-child { margin-bottom: 0; }
.tiptap__prosemirror h1 { font-size: 1.9em; font-weight: 700; margin: 0.8em 0 0.25em; line-height: 1.2; color: #111827; }
.tiptap__prosemirror h2 { font-size: 1.45em; font-weight: 700; margin: 0.8em 0 0.25em; line-height: 1.3; color: #111827; }
.tiptap__prosemirror h3 { font-size: 1.2em; font-weight: 600; margin: 0.8em 0 0.25em; color: #111827; }
.tiptap__prosemirror h4 { font-size: 1.05em; font-weight: 600; margin: 0.8em 0 0.25em; color: #374151; }
.tiptap__prosemirror ul, .tiptap__prosemirror ol { padding-left: 1.75em; margin: 0.4em 0; }
.tiptap__prosemirror li { margin-bottom: 0.2em; }
.tiptap__prosemirror blockquote { border-left: 3px solid #e5e7eb; padding-left: 1em; margin: 0.6em 0; color: #6b7280; font-style: italic; }
.tiptap__prosemirror u { text-decoration: underline; }
.tiptap__prosemirror s { text-decoration: line-through; }
.tiptap__prosemirror a { color: #2563eb; text-decoration: underline; text-underline-offset: 2px; }
.tiptap__prosemirror a:hover { color: #1d4ed8; }

/* Tables */
.tiptap__prosemirror table { border-collapse: collapse; width: 100%; margin: 0.75em 0; table-layout: fixed; }
.tiptap__prosemirror td, .tiptap__prosemirror th { border: 1px solid #e5e7eb; padding: 7px 11px; vertical-align: top; min-width: 60px; position: relative; }
.tiptap__prosemirror th { background: #f9fafb; font-weight: 600; color: #374151; }
.tiptap__prosemirror .selectedCell { background: var(--te-accent-cell); outline: 2px solid var(--te-accent-border); outline-offset: -1px; }

/* ── Table grid picker ─────────────────────────────────────────────── */
.tiptap__table-picker-wrap { position: relative; }
.tiptap__picker-backdrop { position: fixed; inset: 0; z-index: 99; }

@keyframes tiptap-slide-down {
  from { opacity: 0; transform: translateY(-5px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.tiptap__table-picker {
  position: absolute; top: calc(100% + 6px); left: 0; z-index: 100;
  background: #fff; border: 1px solid var(--te-border); border-radius: 8px;
  padding: 10px; box-shadow: 0 6px 20px rgba(0,0,0,0.09);
  user-select: none; animation: tiptap-slide-down 0.12s ease;
}
.tiptap__table-picker-label { font-size: 11px; font-weight: 600; color: #adadba; text-align: center; margin-bottom: 8px; letter-spacing: 0.04em; text-transform: uppercase; min-height: 14px; }
.tiptap__table-picker-grid { display: flex; flex-direction: column; gap: 3px; }
.tiptap__table-picker-row  { display: flex; gap: 3px; }
.tiptap__table-picker-cell { width: 17px; height: 17px; border: 1px solid var(--te-border-light); border-radius: 2px; background: #fafafa; cursor: pointer; flex-shrink: 0; transition: background 60ms, border-color 60ms; }
.tiptap__table-picker-cell--active { background: var(--te-accent-bg); border-color: var(--te-accent-bg2); }
.tiptap__table-picker-cell:hover { background: var(--te-accent-bg); border-color: var(--te-accent); }

/* ── Link dialog ───────────────────────────────────────────────────── */
.tiptap__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: center; z-index: 10; border-radius: inherit; }
.tiptap__dialog { background: #fff; border: 1px solid var(--te-border); border-radius: 10px; padding: 20px; width: 340px; box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
.tiptap__dialog-title { font-size: 14px; font-weight: 600; color: #111827; margin: 0 0 14px; }
.tiptap__dialog-label { display: block; font-size: 11.5px; font-weight: 600; color: #8c8c9a; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.05em; }
.tiptap__dialog-input { width: 100%; padding: 7px 10px; border: 1px solid var(--te-border); border-radius: 6px; font-size: 13px; color: #111827; outline: none; }
.tiptap__dialog-input:focus { border-color: var(--te-accent); box-shadow: 0 0 0 3px var(--te-accent-ring); }
.tiptap__dialog-check {
  display: flex; align-items: center; gap: 8px;
  margin-top: 12px; cursor: pointer;
  font-size: 13px; color: #374151;
}
.tiptap__dialog-check input[type="checkbox"] {
  width: 15px; height: 15px; margin: 0;
  accent-color: var(--te-accent); cursor: pointer; flex-shrink: 0;
}
.tiptap__dialog-actions { display: flex; gap: 8px; margin-top: 16px; justify-content: flex-end; }
.tiptap-root .tiptap__dialog-btn { display: inline-flex; align-items: center; padding: 6px 14px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; border: 1px solid var(--te-border); background: #f9fafb; color: #374151; transition: background 100ms; }
.tiptap-root .tiptap__dialog-btn:hover { background: #f0f0f3; }
.tiptap-root .tiptap__dialog-btn--primary { background: var(--te-accent); color: #fff; border-color: var(--te-accent); }
.tiptap-root .tiptap__dialog-btn--primary:hover { background: var(--te-accent-dark); border-color: var(--te-accent-dark); }

/* ── Tippy reset for bubble menus ──────────────────────────────────── */
.tippy-box[data-theme~='tiptap-bubble'] { background: transparent; box-shadow: none; border: none; overflow: visible; }
.tippy-box[data-theme~='tiptap-bubble'] > .tippy-content { padding: 0; overflow: visible; }
.tippy-box[data-theme~='tiptap-bubble'] > .tippy-arrow { display: none; }

/* ── Link bubble ───────────────────────────────────────────────────── */
.tiptap__link-bubble {
  display: flex; align-items: center; gap: 2px;
  padding: 3px 8px 3px 6px;
  background: #fff; border: 1px solid var(--te-border);
  border-radius: 7px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}
.tiptap__link-bubble-url { font-size: 12px; color: #2563eb; text-decoration: none; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 0 4px; }
.tiptap__link-bubble-url:hover { text-decoration: underline; }

/* ── Table bubble ──────────────────────────────────────────────────── */
.tiptap__table-bubble {
  display: flex; align-items: center; gap: 1px; padding: 4px 6px;
  background: #fff; border: 1px solid var(--te-border);
  border-radius: 8px; box-shadow: 0 6px 22px rgba(0,0,0,0.11); overflow: visible;
}

/* ── Fixed-position bubble tip ─────────────────────────────────────── */
.tiptap__bubble-tip {
  position: fixed; transform: translate(-50%, -100%); margin-top: -4px;
  background: #1f2937; color: #f9fafb;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  font-size: 11px; font-weight: 500; line-height: 1.3;
  padding: 4px 8px; border-radius: 5px; white-space: nowrap;
  pointer-events: none; z-index: 9999;
}

/* ── Custom data-tip tooltips (main toolbar only) ──────────────────── */
.tiptap-root [data-tip] { position: relative; }
.tiptap-root [data-tip]::after {
  content: attr(data-tip); position: absolute;
  top: calc(100% + 7px); left: 50%;
  transform: translateX(-50%) translateY(-2px);
  background: #1f2937; color: #f9fafb;
  font-size: 11px; font-weight: 500; line-height: 1.3;
  padding: 4px 8px; border-radius: 5px; white-space: nowrap;
  pointer-events: none; opacity: 0;
  transition: opacity 0.1s, transform 0.1s; transition-delay: 0s; z-index: 200;
}
.tiptap-root [data-tip]:hover::after { opacity: 1; transform: translateX(-50%) translateY(0); transition-delay: 0.35s; }

/* Upward variant — for elements at the bottom of the editor */
.tiptap-root [data-tip-up] { position: relative; }
.tiptap-root [data-tip-up]::after {
  content: attr(data-tip-up); position: absolute;
  bottom: calc(100% + 7px); left: 50%;
  transform: translateX(-50%) translateY(2px);
  background: #1f2937; color: #f9fafb;
  font-size: 11px; font-weight: 500; line-height: 1.3;
  padding: 4px 8px; border-radius: 5px; white-space: nowrap;
  pointer-events: none; opacity: 0;
  transition: opacity 0.1s, transform 0.1s; transition-delay: 0s; z-index: 200;
}
.tiptap-root [data-tip-up]:hover::after { opacity: 1; transform: translateX(-50%) translateY(0); transition-delay: 0.35s; }

/* ── Status bar ────────────────────────────────────────────────────── */
.tiptap__statusbar {
  display: flex; align-items: center; padding: 4px 13px;
  border-top: 1px solid var(--te-border-light); background: #fafafa;
  font-size: 11px; color: #b0b0bc; border-radius: 0 0 8px 8px;
  user-select: none;
}
.tiptap__statusbar-sep { display: inline-block; width: 1px; height: 10px; background: var(--te-border-light); margin: 0 8px; }
.tiptap__statusbar-logo { display: inline-flex; align-items: center; color: #6b7280; }
.tiptap__statusbar-logo svg { height: 25px; width: auto; display: block; }
</style>
