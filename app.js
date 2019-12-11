
const init = () => {
	getBaseText()
	getInitialImage()
	generateScreenshot()
}

function getInitialImage() {
	let request = new XMLHttpRequest();
	let url = document.querySelector(".meme-image img").src
	request.open('GET', url, true);
	request.responseType = 'blob';
	request.onload = function() {
		var reader = new FileReader();
		reader.onloadend = function() {
			document.querySelector(".meme-image img").src = reader.result;
		};
		reader.readAsDataURL(request.response);
	};
	request.send();
}

function generateScreenshot() {
	let meme = document.getElementById('meme')

	html2canvas(meme, {scale: window.devicePixelRatio}).then(function(canvas) {
		const data = canvas.toDataURL('image/jpeg');
		const src = encodeURI(data);
		document.getElementById("download-meme").setAttribute("href", src);
	});
}

function getBaseUrl() {
	var file = document.querySelector('input[type=file]')['files'][0];
	var reader = new FileReader();
	reader.onloadend = function() {
		document.querySelector(".meme-image img").src = reader.result;
		getBaseText(); // refresh text
		generateScreenshot() // auto generates on image change
	};
	reader.readAsDataURL(file);
}

function getBaseText() {
	document.querySelector(".meme-text pre").innerHTML = document.querySelector("textarea").value
	generateScreenshot()
}

window.onload = init()
document.getElementById("meme-image").addEventListener("change", getBaseUrl);
document.getElementById("meme-text").addEventListener("mouseout", getBaseText);
