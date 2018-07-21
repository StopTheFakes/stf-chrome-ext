
chrome.commands.onCommand.addListener(command => {
	if (command === 'make-screenshot') {
		chrome.storage.local.get(['currentItem'], result => {
			let item = (result || {}).currentItem;
			if (item) {
				chrome.storage.local.get(['screenshots'], result => {
					let screenshots = (result || {}).screenshots || {};
					screenshots[item.id] = screenshots[item.id] || [];
					chrome.tabs.captureVisibleTab(null, {}, img => {
						screenshots[item.id].push({ id: screenshots[item.id].length, img });
						chrome.storage.local.set({ screenshots });
					});
				});
			}
			chrome.tabs.query({active: true, currentWindow: true}, tabs => {
				chrome.tabs.sendMessage(tabs[0].id, {
					command,
					makeScreenshot: !!item,
					error: item ? null : 'Choose request first',
					success: item ? `Screenshot captured for request "${item.title}"` : null
				});
			});
		});
	}
});