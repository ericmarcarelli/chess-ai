(function($) {
  ChessAI.Modules.Options = function() {
    var self = this;
    this.playerColor = ChessAI.Color.White;

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

    /**
     * If true, do not allow illegal moves.
     * @return {bool}
     */
    this.isConstrainedToLegalMoves = function() {
      if ($('#constrain-legal:checked').length) {
        return true;
      }
      return false;
    }

    /**
     * Return max search plies
     * @return {int}
     */
    this.getMaxPlies = function() {
      return parseInt($('#plies').val()) - 1;
    }

    return this.init();
  };
})(jQuery);
