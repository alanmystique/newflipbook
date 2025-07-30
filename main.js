const urlParams = new URLSearchParams(window.location.search);
const pdfUrl = urlParams.get('pdf') || 'sample.pdf';

let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
const appContainer = document.getElementById('flipbook-app');

pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
  pdfDoc = pdf;
  totalPages = pdf.numPages;
  preloadPages();
}).catch(err => {
  alert('Failed to load PDF: ' + err.message);
});

function preloadPages() {
  const pages = [];
  let loaded = 0;

  for (let i = 1; i <= totalPages; i++) {
    pdfDoc.getPage(i).then(page => {
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      page.render({ canvasContext: ctx, viewport }).promise.then(() => {
        const img = new Image();
        img.src = canvas.toDataURL();
        pages[i - 1] = img;
        loaded++;
        if (loaded === totalPages) {
          initializeFlipbook(pages);
        }
      });
    });
  }
}

function initializeFlipbook(pages) {
  // FlipbookViewer expects a context with book pages
  const ctx = {
    book: {
      numPages: () => pages.length,
      getPage: (i, cb) => cb(null, { img: pages[i] })
    },
    sz: {
      boxw: 800,
      boxh: 600,
      marginTop: 0,
      marginLeft: 0,
      bx_border: 2
    },
    color: {
      bg: '#fff',
      bx: '#ddd'
    },
    app: {
      c: (el) => { appContainer.innerHTML = ''; appContainer.appendChild(el); },
      attr: (attrs) => {
        for (const key in attrs) {
          appContainer[key] = attrs[key];
        }
      },
      getBoundingClientRect: () => appContainer.getBoundingClientRect()
    }
  };

  flipbookViewer(ctx, (err, viewer) => {
    if (err) return alert('Error initializing flipbook');
    setupControls(viewer);
  });
}

function setupControls(viewer) {
  document.getElementById('prevPage').addEventListener('click', () => viewer.flip_back());
  document.getElementById('nextPage').addEventListener('click', () => viewer.flip_forward());
  document.getElementById('zoomIn').addEventListener('click', () => viewer.zoom((viewer.zoomLevel || 0) + 1));
  document.getElementById('zoomOut').addEventListener('click', () => viewer.zoom((viewer.zoomLevel || 0) - 1));
}