(function($) {
  ChessAI.Modules.States = function() {
    var self = this;
    var P = ChessAI.Piece;
    var MoveType = { Invalid : 0, Move : 1, Capture : 2};

    this.init = function() {
      return this;
    };

    /**
     * Get array of legal moves for a square.
     * @todo currently missing moves such as castling and en passant capture
     * @todo does not account for moves that result in check
     *
     * @param  {Array} state  8x8 array of board
     * @param  {int} row
     * @param  {int} col
     * @return {Array} moves
     */
    this.getMovesForSquare = function(state, row, col) {
      var moves = [];
      var piece = state[row][col];
      var directions = [];
      var moveType;

      switch(piece) {
        case P.BlackQueen:
        case P.WhiteQueen:
          // the queen has all the moves of the bishop and rook

        case P.WhiteBishop:
        case P.BlackBishop:
          directions = [[-1,-1], [-1,1], [1,1], [1,-1]];

        case P.WhiteRook:
        case P.BlackRook:
          if (piece != P.WhiteBishop && piece != P.BlackBishop) {
            directions = directions.concat([[-1,0], [0,-1], [1,0], [0,1]]);
          }

          for(var i = 0; i < directions.length; i++) {
            for(var j = 1; j < 8; j++) {
              moveType = validMove(piece, state, row + (directions[i][0] * j), col + (directions[i][1] * j));
              if (moveType != MoveType.Invalid) {
                moves.push(new ChessAI.Move(piece, row, col, row + (directions[i][0] * j), col + (directions[i][1] * j)));
              }
              if (moveType != MoveType.Move) {
                break;
              }
            }
          }

          break;

        case P.BlackKnight:
        case P.WhiteKnight:
          var offsets = [[-2,1], [-1,2], [1,2], [2,1], [2,-1], [1,-2], [-1,-2], [-2,-1]];
          for(var i = 0; i < offsets.length; i++) {
            if (validMove(piece, state, row + offsets[i][0], col + offsets[i][1]) != MoveType.Invalid) {
              moves.push(new ChessAI.Move(piece, row, col, row + offsets[i][0], col + offsets[i][1]));
            }
          }
          break;

        case P.BlackKing:
        case P.WhiteKing:
          for(var i = -1; i < 2; i++) {
            for(var j = -1; j < 2; j++) {
              if (i == 0 && i == 0)
                continue;
              if (validMove(piece, state, row + i, col + j) != MoveType.Invalid) {
                moves.push(new ChessAI.Move(piece, row, col, row + i, col + j));
              }
            }
          }
          break;

        case P.BlackPawn:
        case P.WhitePawn:
          var dir = piece == P.BlackPawn ? 1 : -1;
          var initialRow = piece == P.BlackPawn ? 1 : 6;

          // initial move
          if (row == initialRow && state[row+(dir*2)][col] == P.Empty) {
            moves.push(new ChessAI.Move(piece, row, col, row+(dir*2), col));
          }
          // regular advance
          if (state[row+dir][col] == P.Empty) {
            moves.push(new ChessAI.Move(piece, row, col, row+dir, col));
          }

          // captures
          if (col > 0) {
            if (state[row+dir][col-1] != P.Empty &&
              canCapture(piece, state[row+dir][col-1])) {
              moves.push(new ChessAI.Move(piece, row, col, row+dir, col-1));
            }
          }
          if (col < 7) {
            if (state[row+dir][col+1] != P.Empty &&
              canCapture(piece, state[row+dir][col+1])) {
              moves.push(new ChessAI.Move(piece, row, col, row+dir, col+1));
            }
          }
          break;
      }

      return moves;
    };

    /**
     * Determine if the attacker can capture the target piece.
     * @param  {ChessAI.Piece} attacker
     * @param  {ChessAI.Piece} target
     * @return {bool}
     */
    var canCapture = function(attacker, target) {
      if (!attacker)
        return false;

      if (attacker < P.WhiteRook && target > P.BlackPawn && target != P.WhiteKing) {
        return true;
      }
      if (attacker > P.BlackPawn && target < P.WhiteRook && target != P.BlackKing) {
        return true;
      }

      return false;
    };

    /**
     * Checks if a potential move by a piece in a state is valid.
     * This function is not intended for pawns.
     * @todo check
     *
     * @param  {ChessAI.Piece} piece
     * @param  {ChessAI.State} state
     * @param  {int} row
     * @param  {int} col
     * @return {MoveType}
     */
    var validMove = function(piece, state, row, col) {
      // piece would move off board
      if (row < 0 || col < 0 || row > 7 || col > 7)
        return MoveType.Invalid;
      var target = state[row][col];
      if (target == P.Empty)
        return MoveType.Move;
      if (canCapture(piece, target))
        return MoveType.Capture;
      return MoveType.Invalid;
    }

    return this.init();
  };
})(jQuery);
