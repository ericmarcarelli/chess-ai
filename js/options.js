(function($) {
  ChessAI.Modules.Options = function() {
    var self = this;
    var $options = $('.options');

    this.init = function() {
      $('.options .rotate').click(function() {
        ChessAI.LoadedModules.Board.rotateBoard();
      });

      $('.options .cancel-move').click(function() {
        $('.board .square').removeClass('selected');
        $('.board .square').removeClass('highlight');
        $(this).prop('disabled', true);
      });

      return this;
    };

    return this.init();
  };
})(jQuery);
