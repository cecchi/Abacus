$(document).ready(function() {
  "use strict";

  /* Calendar */
  $('.ui-calendar')
    .each(function(){
      // Make grid
      $(this).append('<div class="ui-grid rounded-bottom-left rounded-bottom-right" />');
      var $grid = $(this).find('.ui-grid');

      // Get and/or set the date
      var date = $(this).data('datetime') ? new Date($(this).data('datetime')) : new Date();
      $(this).data('datetime', date);

      // Calculate what day of the week the month starts on
      var start = (date.getDay() - ((date.getDate() - 1) % 7) + 7) % 7;

      // Calculate the number of days in the month
      var days  = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

      // Add the grid header
      var cols = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'],
          $header = $('<div class="ui-row ui-header" />');
      for(var i in cols) {
        $header.append($('<div class="ui-cell">' + cols[i] + '</div>'));
      }
      $grid.append($header);

      // Add the day cells
      for(var i = (1 - start); i < (36 - start); i++) {
        var d     = new Date(date.getFullYear(), date.getMonth(), i),
            $cell = $('<div class="ui-cell"><time datetime="' + d.toISOString() + '">' + d.getDate() + '</time></div>');
        
        // Add special cell classes
        if(i <= 0 || i > days) {
          $cell.addClass('disabled');
        } else if(i == date.getDate()) {
          $cell.addClass('today');
          $cell.append($('<div class="fold" />'));
        } else if(i - 7 == date.getDate()) {
          $cell.addClass('below-today');
        }

        // Insert the cell
        $grid.append($cell);

        // Wrap each group of cells at the end of each week
        if((i + start) % 7 === 0) {
          $grid.children('.ui-cell').wrapAll('<div class="ui-row" />');
        }
      }

      // Add the header
      var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      $grid.before($('<div class="ui-calendar-header rounded-top-left rounded-top-right">' + months[date.getMonth()].toUpperCase() + ' ' + date.getFullYear() + '</div>'));
    });

  /* Grid */
  $('.ui-grid')
    .on('set-range', function(event, from, to) {
      var $grid  = $(this).closest('.ui-grid'),
          $cells = $grid.find('.ui-cell');

      // Ensure "from" comes before "to"
      if($cells.index(from) > $cells.index(to)) {
        var tmp = from;
        from = to;
        to = tmp;
      }

      // Reset cells
      $cells.removeClass('active below-active selected');
      var active = false;

      // Activate selected cells
      $cells.not(':disabled').each(function() {
        var $cell = $(this);
        if(active = $cell.is(from) ? true : active) {
          $cell.addClass('active');
          $cell.closest('.ui-row').next().find('.ui-cell').eq($cell.index()).addClass('below-active');
        }
        if($cell.is(to)) {
          $cell.addClass('selected');
          return false;
        }
      });
    })
    .on('mousedown', '.ui-cell:not(.disabled)', function(event) {
      var $grid    = $(this).closest('.ui-grid'),
          $cells   = $grid.find('.ui-cell'),
          $actives = $cells.filter('.active');

      // Shift-click changes the start or end of the range
      if(event.shiftKey) {
        if($cells.index(this) < $cells.index($actives.get(0))) {
          $grid.trigger('set-range', [this, $actives.last().get(0)]);
        } else {
          $grid.trigger('set-range', [$actives.get(0), this]);
        }
        $grid.data('ui-grid-anchor', $actives.get(0));
      } else {
        $grid.trigger('set-range', [this, this]);
        $grid.data('ui-grid-anchor', this);
      }
    })
    .on('mouseover', '.ui-cell:not(.disabled)', function() {
      var $grid  = $(this).closest('.ui-grid'),
          anchor = $grid.data('ui-grid-anchor');

      if(anchor !== false) {
        $('.ui-grid').trigger('set-range', [anchor, this]);
      }
    })
    .data('ui-grid-anchor', false);

  $(window).on('mouseup', function() {
    $('.ui-grid').data('ui-grid-anchor', false);
  });
});