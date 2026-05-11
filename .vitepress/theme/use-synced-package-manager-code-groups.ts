import { inBrowser, onContentUpdated } from 'vitepress'

const packageManagers = new Set([
  'npm',
  'yarn',
  'pnpm',
  'bun',
  'deno',
])
const storageKey = 'hono:package-manager-tab'

function getStoredPackageManager() {
  try {
    return localStorage.getItem(storageKey)
  } catch {
    return null
  }
}

function setStoredPackageManager(title: string) {
  try {
    localStorage.setItem(storageKey, title)
  } catch {
    // Keep current-page tab syncing working when persistent storage is unavailable.
  }
}

function getInputLabel(group: Element, input: HTMLInputElement) {
  return Array.from(
    group.querySelectorAll<HTMLLabelElement>('.tabs label')
  ).find((label) => label.htmlFor === input.id)
}

function getLabelTitle(group: Element, input: HTMLInputElement) {
  return getInputLabel(group, input)?.dataset.title
}

function getPackageManagerTitleFromInput(input: HTMLInputElement) {
  const group = input.closest('.vp-code-group')
  if (!group) return

  const title = getLabelTitle(group, input)
  return title && packageManagers.has(title) ? title : undefined
}

function hasPackageManagerTabs(group: Element) {
  return Array.from(
    group.querySelectorAll<HTMLLabelElement>('.tabs label')
  ).some((label) => packageManagers.has(label.dataset.title ?? ''))
}

function activateCodeGroupTab(group: Element, title: string) {
  const labels = Array.from(
    group.querySelectorAll<HTMLLabelElement>('.tabs label')
  )
  const index = labels.findIndex(
    (label) => label.dataset.title === title
  )
  if (index < 0) return

  const inputs = Array.from(
    group.querySelectorAll<HTMLInputElement>('.tabs input')
  )
  const blocks = group.querySelector('.blocks')
  const nextBlock = blocks?.children[index]
  if (!nextBlock) return

  inputs.forEach((input) => {
    input.checked = false
  })
  if (inputs[index]) {
    inputs[index].checked = true
  }

  Array.from(blocks.children).forEach((block) => {
    block.classList.remove('active')
  })
  nextBlock.classList.add('active')
}

function syncCodeGroups(root: ParentNode, title: string) {
  if (!packageManagers.has(title)) return

  root.querySelectorAll('.vp-code-group').forEach((group) => {
    if (hasPackageManagerTabs(group)) {
      activateCodeGroupTab(group, title)
    }
  })
}

export function useSyncedPackageManagerCodeGroups() {
  if (!inBrowser) return

  onContentUpdated(() => {
    const title = getStoredPackageManager()
    if (title) {
      syncCodeGroups(document, title)
    }
  })

  window.addEventListener('click', (event) => {
    const input = event.target
    if (!(input instanceof HTMLInputElement)) return
    if (!input.matches('.vp-code-group input')) return

    const title = getPackageManagerTitleFromInput(input)
    if (!title) return

    setStoredPackageManager(title)
    queueMicrotask(() => syncCodeGroups(document, title))
  })
}
