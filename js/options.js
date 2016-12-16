(function($) {
  ChessAI.Modules.Options = function() {
    var self = this;
    var $options = $('.options');

    this.init = function() {
      $('.options .rotate').click(function() {
        console.log(ChessAI.Modules);
        ChessAI.Modules.Board.rotateBoard();
      });

      return this;
    };

    return this.init();
  };
})(jQuery);
