
(() => {
	const wrapper = document.createElement('div');
	let wrapperTimer;

	wrapper.classList.add('stf-ext-screenshot-status');

	wrapper.innerHTML = '' +
		'<div class="stf-ext-screenshot-status__border-top"></div>' +
		'<div class="stf-ext-screenshot-status__border-right"></div>' +
		'<div class="stf-ext-screenshot-status__border-bottom"></div>' +
		'<div class="stf-ext-screenshot-status__border-left"></div>' +
		'<div class="stf-ext-screenshot-status__message"></div>';

	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		clearTimeout(wrapperTimer);
		document.body.appendChild(wrapper);
		wrapper.classList.remove('success', 'error');
		wrapper.classList.add(request.error ? 'error' : 'success');
		wrapper.querySelector('.stf-ext-screenshot-status__message').innerHTML = request.error || request.success;
		wrapperTimer = setTimeout(() => wrapper.remove(), 5000);
		/*console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension");
		if (request.greeting == "hello")
			sendResponse({farewell: "goodbye"});*/
	});
})();