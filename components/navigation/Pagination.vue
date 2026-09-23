<template>
  <div class="pagination-wrapper">
    <div class="row no-gutters w-100">
      <div :class="`col-12 ${enhancedMode ? 'col-md-6 col-lg-8' : 'col-lg-12 text-right'}`">
        <ol class="nav pagination v-pagination v-zeta">
          <li class="pagination-item pagination__first flush--left">
            <a @click="onClickFirstPage" :class="{ 'inactive': isInFirstPage || loading }">
              First
            </a>
          </li>

          <li class="pagination-item pagination__prev">
            <a @click="onClickPreviousPage" :class="{ 'inactive': isInFirstPage || loading }" aria-label="Go to previous page">
              Prev
            </a>
          </li>

          <template v-if="enhancedMode">
            <li class="pagination-item pagination__input">
              <input v-model="gotoPage" type="text" inputmode="numeric" pattern="[0-9]*" :maxlength="maxLength" :class="{ 'inactive': totalPages == 1 || loading }" @keyup.enter="pageEnterPressed" @keypress="onlyNumber" />
            </li>

            <li class="pagination-item pagination__label">
              <div v-if="totalPages > 0" class="page-count">
                of {{ totalPages }} page{{ totalPages > 1 ? 's' : '' }}
              </div>
            </li>

            <li class="pagination-item pagination__submit">
              <button class="btn btn--inverted btn--natural" type="button" ref="enterPageValue" :class="{ 'inactive': totalPages == 1 || loading }" @click="onClickGotoPage">
                <span class="entypo--right-dir"></span>
              </button>
            </li>
          </template>
          <template v-else>
            <li v-for="(page, index) in pages" :key="index" class="pagination-item">
              <a @click="onClickPage(page.name)" :class="{ 'active': isPageActive(page.name), 'inactive': page.isDisabled || loading }" :aria-label="`Go to page number ${page.name}`">
                {{ page.name }}
              </a>
            </li>
          </template>

          <li class="pagination-item pagination__next">
            <a @click="onClickNextPage" :class="{ 'inactive': isInLastPage || loading }" aria-label="Go to next page">
              Next
            </a>
          </li>

          <li class="pagination-item pagination__last">
            <a @click="onClickLastPage" :class="{ 'inactive': isInLastPage || loading }">
              Last
            </a>
          </li>
        </ol>
      </div>

      <div v-if="enhancedMode" class="col-12 col-md-6 col-lg-4">
        <div class="row-picker-wrapper form-fields v-zeta text-left text-md-right">
          <template v-if="enhancedMode">
            <label for="row-picker" class="row-picker__label">Rows per page</label>
            <select v-model="rowsPerPage" name="row-picker" id="row-picker" class="row-picker__select">
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="75">75</option>
            </select>
          </template>
          <template v-else-if="!enhancedMode && totalPagesText">
            <div v-if="totalPages > 0" class="page-count">
              {{ currentPage }} of {{ totalPages }} pages
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  loading: Boolean,
  maxVisibleButtons: { type: Number, required: false, default: 3 },
  totalPages: { type: Number, required: true },
  totalPagesText: { type: Boolean, default: true },
  total: { type: Number, required: true },
  perPage: { type: Number, required: true },
  currentPage: { type: Number, required: true },
  enhancedMode: { type: Boolean, default: false },
  currentRowsPerPage: { type: Number, default: 25 }
})

const emit = defineEmits(['pagechanged', 'rowsPerPageChanged'])

const gotoPage = ref(props.currentPage)
const rowsPerPage = ref(props.currentRowsPerPage)
const enterPageValue = ref(null)

const startPage = computed(() => {
  if (props.currentPage < props.maxVisibleButtons) return 1

  if (props.currentPage === props.totalPages) {
    const pageNum = props.totalPages - (props.maxVisibleButtons - 1)
    return pageNum < 1 ? 1 : pageNum
  }

  return props.currentPage - 1
})

const endPage = computed(() => Math.min(startPage.value + (props.maxVisibleButtons - 1), props.totalPages))

const pages = computed(() => {
  const range = []

  for (let i = startPage.value; i <= endPage.value; i += 1) {
    range.push({
      name: i,
      isDisabled: i === props.currentPage
    })
  }

  return range
})

const isInFirstPage = computed(() => props.currentPage === 1)

const isInLastPage = computed(() => props.currentPage === props.totalPages)

const maxLength = computed(() => props.totalPages.toString().length)

function isPageActive(page) {
  return props.currentPage === page
}

function onClickFirstPage() {
  emit('pagechanged', 1)
}

function onClickPreviousPage() {
  emit('pagechanged', props.currentPage - 1)
}

function onClickPage(page) {
  emit('pagechanged', page)
}

function onClickNextPage() {
  emit('pagechanged', props.currentPage + 1)
}

function onClickLastPage() {
  emit('pagechanged', props.totalPages)
}

function onClickGotoPage() {
  let pageNum = parseInt(gotoPage.value, 10)

  if (isNaN(pageNum)) {
    pageNum = 1
  } else if (pageNum > props.totalPages) {
    pageNum = props.totalPages
  } else if (pageNum < 1) {
    pageNum = 1
  }

  emit('pagechanged', pageNum)
}

function pageEnterPressed() {
  if (enterPageValue.value) enterPageValue.value.click()
}

function onlyNumber($event) {
  const keyCode = $event.keyCode ? $event.keyCode : $event.which
  if (keyCode < 48 || keyCode > 57) {
    $event.preventDefault()
  }
}

watch(gotoPage, (value) => {
  if (value > props.totalPages) {
    gotoPage.value = props.totalPages
  }
})

watch(() => props.currentPage, (value) => {
  gotoPage.value = value
})

watch(rowsPerPage, (value) => {
  let rows = parseInt(value, 10)
  if (isNaN(rows)) {
    rows = 25
  }
  emit('rowsPerPageChanged', rows)
})
</script>
