const url = '../docs/c4611_sample_explain.pdf';

let pdfDoc = null,
	pageNum = 1,
	pageIsRendering = false,
	pageNumIsPending = null;

const scale = 1.5,
	canvas = document.querySelector('#pdf-render'),
	ctx = canvas.getContext('2d');

// REnder The Page
const renderPage = num => {
	pageIsRendering = true;

	//Get Page
	pdfDoc.getPage(num).then(page => {
		// set scale
		const viewport = page.getViewport({ scale });
		canvas.height = viewport.height;
		canvas.width = viewport.width;

		const renderCtx = {
			canvasContext: ctx,
			viewport,
		};

		page.render(renderCtx).promise.then(() => {
			pageIsRendering = false;

			if (pageNumIsPending !== null) {
				renderPage(pageNumIsPending);
				pageNumIsPending = null;
			}
		});
		//Output curent page
		document.querySelector('#page-num').textContent = num;
	});
};

//Check for pages Rendering
const queueRenderPage = num => {
	if (pageIsRendering) {
		pageNumIsPending = num;
	} else {
		renderPage(num);
	}
};

//Show Prev Page
const showPrevPage = () => {
	if (pageNum <= 1) {
		return;
	}
	pageNum--;
	queueRenderPage(pageNum);
};

//Show Next Page
const showNextPage = () => {
	if (pageNum >= pdfDoc.numPages) {
		return;
	}
	pageNum++;
	queueRenderPage(pageNum);
};

//Get Document
pdfjsLib
	.getDocument(url)
	.promise.then(pdfDoc_ => {
		pdfDoc = pdfDoc_;
		console.log(pdfDoc);

		document.querySelector('#num-pages').textContent = pdfDoc.numPages;

		renderPage(pageNum);
	})
	.catch(err => {
		//Displaay error;
		const div = document.createElement('div');
		div.className = 'error';
		div.appendChild(document.createTextNode(err.message));
		document.querySelector('body').insertBefore(div, canvas);
		//Remove topbar
		document.querySelector('.top-bar').style.display = 'none';
	});

//Button Event
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);
