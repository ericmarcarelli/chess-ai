(function($) {
  ChessAI.Modules.Options = function() {
    var self = this;

    this.init = function() {
      $('.options .rotate').click(function() {
        ChessAI.LoadedModules.Board.rotateBoard();
      });

      $('.options .reset').click(function() {
        ChessAI.LoadedModules.Board.setupBoard();
        $('.options .cancel-move').prop('disabled', true);
      });

      $('.options .cancel-move').click(function() {
        $('.board .square').removeClass('selected highlight');
        $(this).prop('disabled', true);
      });

      return this;
    };

    this.isConstrainedToLegalMoves = function() {
      if ($('#constrain-legal:checked').length) {
        return true;
      }
      return false;
    }

    return this.init();
  };
})(jQuery);
