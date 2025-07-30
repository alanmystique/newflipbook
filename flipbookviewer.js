
'use strict'
import { h } from '@tpp/htm-x';
import * as EventEmitter from 'events';

class FlipbookViewer extends EventEmitter {};

const outputScale = window.devicePixelRatio || 1; // Support HiDPI-screens

/*    way/
 * set up the canvas and the toolbar, return the viewer,
 * then show the first page
 */
export function flipbookViewer(ctx, cb) {
  const viewer = new FlipbookViewer();
  viewer.page_count = ctx.book.numPages();

  setupCanvas(ctx, err => {
    if(err) return cb(err);

    calcLayoutParameters(ctx, err => {
      if(err) return cb(err);

      ctx.app.c(ctx.canvas.e);

      setupMouseHandler(ctx, viewer);

      ctx.zoom = 0;
      ctx.showNdx = 0;

      setupControls(ctx, viewer);

      cb(null, viewer);

      showPages(ctx, viewer);

    });

  });

}

/* Additional functions from the original flipbookviewer.js... */
