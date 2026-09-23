<template>
  <div class="file-uploader">
    <user-message v-if="!showErrorInPopup && invalidFile" type="negative" :class="['mt-2 file-error', { 'flash': flashFileError }]" :closable="!hideDismissFileTypeError" @closeCallback="invalidFile = false" ref="fileTypeError">
      <p class="w-100">
        <slot name="incorrectFileError">
          You are trying to upload a file type which is not allowed.
        </slot>
      </p>
    </user-message>

    <div v-bind="getRootProps()" class="add-attachment__dropzone-container" :class="{'has-attachments': hasAttachments, 'is-white': hasWhiteBg, 'inactive': isDisabled}">
      <input v-bind="getInputProps()" />
      <div class="add-attachment__dropzone-information" v-if="!hasAttachments"></div>
      <a href="javascript:" v-if="!isDisabled" :class="hasAttachments ? 'd-flex align-items-center justify-content-center' : ''">
        <i v-if="hasAttachments" class="entypo--upload-cloud mr-2 gamma"></i>

        <template v-if="!isUploading">
          <slot name="upload-text">
            <div>
              <strong>Drag & Drop</strong> files here or <strong>click to explore...</strong>
            </div>
          </slot>
        </template>
        <template v-else>
          <slot name="loading">
            <div class="uploader-loading d-flex align-items-center justify-content-center">
              <span class="entypo--arrows-ccw mr-2 spin"></span> Uploading...
            </div>
          </slot>
        </template>
      </a>
      <a href="javascript:" v-if="isDisabled">
        You will be able to upload files relevant to the {{ disabledMessage }} here
      </a>
    </div>

    <modal-component v-if="showErrorInPopup && invalidFile" class="text--center">
      <template #header>
        <h2 class="text--center">
          <span class="entypo--alert color--negative"></span> Invalid File
        </h2>
      </template>
      <template #default>
        <div class="epsilon text--center">
          <p>You are trying to upload a file type which is not allowed.</p>
        </div>
      </template>
      <template #footer>
        <button class="btn" @click.prevent="invalidFile = false">
          <span class="entypo--check"></span> Done
        </button>
      </template>
    </modal-component>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDropzone } from 'vue3-dropzone'
import UserMessage from '../feedback/UserMessage.vue'

const props = defineProps({
  hasAttachments: Boolean,
  isDisabled: Boolean,
  multipleFiles: { type: Boolean, default: true },
  disabledMessage: { type: String, default: 'development feedback' },
  showErrorInPopup: { type: Boolean, default: false },
  hasWhiteBg: Boolean,
  expectedFileTypes: { type: String, default: '' },
  hideDismissFileTypeError: { type: Boolean, default: false }
})

const emit = defineEmits(['upload'])

const files = ref([])
const invalidFile = ref(false)
const isUploading = ref(false)
const flashFileError = ref(false);

function validateFileExtension(file) {
  const invalidExtensions = ['exe', 'bat', 'js', 'cs', 'dll', 'cmd', 'jar', 'ps1', 'py']
  const extension = file.name.split('.').pop().toLowerCase()
  return !invalidExtensions.includes(extension)
}

function clearFiles() {
  files.value = []
}

function uploadFiles() {
  if (files.value.length > 0) {
    emit('upload', files.value)
    clearFiles()
  }
}

function generateUuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  )
}

async function onDrop(acceptedFiles, rejectedFiles) {
  if (rejectedFiles && rejectedFiles.length > 0) {
    showFileError();
    return;
  }

  if (acceptedFiles.length === 0) return
  isUploading.value = true

  await new Promise(resolve => requestAnimationFrame(resolve))

  for (const file of acceptedFiles) {
    if (props.isDisabled) continue

    if (!validateFileExtension(file)) {
      invalidFile.value = true
      isUploading.value = false
      return
    }

    await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = function (e) {
        const base64Content = e.target.result.split(',')[1]
        const fileData = {
          Content: base64Content,
          ContentLength: file.size,
          FileName: file.name,
          Type: file.type,
          UploadUuid: file.uploadUuid || generateUuid()
        }
        files.value.push(fileData)
        resolve()
      }
      reader.readAsDataURL(file)
    })
  }

  uploadFiles()
  isUploading.value = false
}

const showFileError = () => {
  if (!invalidFile.value) invalidFile.value = true;
  else {
    flashFileError.value = true;
    setTimeout(() => flashFileError.value = false, 300);
  }
};

const { getRootProps, getInputProps } = useDropzone({
  onDrop,
  multiple: props.multipleFiles,
  accept: props.expectedFileTypes
})
</script>
