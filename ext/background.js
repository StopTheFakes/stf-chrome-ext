
chrome.commands.onCommand.addListener(command => {
	chrome.storage.local.get(['screenshots'], result => {
		alert(JSON.stringify(result));
	});
	chrome.tabs.query({active: true, currentWindow: true}, tabs => {
		chrome.tabs.sendMessage(tabs[0].id, { command });
	});
});