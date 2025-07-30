const urlParams = new URLSearchParams(window.location.search);
const pdfUrl = urlParams.get('pdf') || 'pdfs/example.pdf';

let pdfDoc = null;
let currentPage = 1;
let scale = 1;
const appContainer = document.getElementById('flipbook-app');

pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
  pdfDoc = pdf;
  renderPage(currentPage);
}).catch(err => {
  appContainer.innerHTML = '<p style="color:white">Failed to load PDF: ' + err.message + '</p>';
});

function renderPage(num) {
  pdfDoc.getPage(num).then(page => {
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    page.render({ canvasContext: ctx, viewport }).promise.then(() => {
      appContainer.innerHTML = '';
      appContainer.appendChild(canvas);
    });
  });
}

document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage <= 1) return;
  currentPage--;
  renderPage(currentPage);
});

document.getElementById('nextPage').addEventListener('click', () => {
  if (currentPage >= pdfDoc.numPages) return;
  currentPage++;
  renderPage(currentPage);
});

document.getElementById('zoomIn').addEventListener('click', () => {
  scale += 0.2;
  renderPage(currentPage);
});

document.getElementById('zoomOut').addEventListener('click', () => {
  if (scale <= 0.4) return;
  scale -= 0.2;
  renderPage(currentPage);
});
