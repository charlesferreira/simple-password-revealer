let passwordRevealerActive = false;

chrome.action.onClicked.addListener((tab) => {
  if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
    console.warn('Cannot inject content script into internal Chrome pages.');
    return;
  }

  chrome.tabs.sendMessage(tab.id, { action: 'togglePasswordReveal' });
});
