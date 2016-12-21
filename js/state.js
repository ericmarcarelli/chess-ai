(function($) {
  ChessAI.Modules.States = function() {
    var self = this;
    var P = ChessAI.Piece;
    var MoveType = { Invalid : 0, Move : 1, Capture : 2};

    this.init = function() {
      return this;
    };

    this.getBestMove = function(state, startColor, currColor, ply) {
    	var best = new ChessAI.State(), nextBest = null;
      var nextColor = ChessAI.Color.flipColor(currColor);
      var moves = this.getAllStates(state.board, currColor);

      // console.log('search: ply ' + ply + ' with ' + moves.length + ' moves');

      for(var i = 0; i < moves.length; i++) {
        if (ply > 0) {
          nextBest = this.getBestMove(moves[i], startColor, nextColor, ply - 1);
          // console.log('ply ' + (ply-1) + ' returned rating ' + nextBest.rating);
          moves[i].rating = nextBest.rating;
        }
        else {
          moves[i].rating = 0; // @todo getRating()
        }

        if (i == 0 || moves[i].rating > best.rating) {
          // console.log('set best on ' + ply);
          best = moves[i];
        }
      }

      // console.log('returning best: ' + best.rating);

    	return best;

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
      var moves = [], ret = [];
      var piece = state[row][col];
      var directions = [];
      var moveType;
      var color = ChessAI.Color.getFromPiece(piece);
      var testState;

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

      // weed out moves resulting in check
      for (var i = 0; i < moves.length; i++) {
        testState = ChessAI.Lib.copy(state);
        testState[moves[i].endRow][moves[i].endCol] = testState[moves[i].startRow][moves[i].startCol];
        testState[moves[i].startRow][moves[i].startCol] = P.Empty;
        if (!self.inCheck(testState, ChessAI.Color.getFromPiece(piece))) {
          ret.push(moves[i]);
        }
      }

      return ret;
    };


    /**
     * Get all legal states for the specified player.
     *
     * @param  {Array} state  8x8 array of board
     * @param  {ChessAI.Color} color
     * @return {Array} States
     */
    this.getAllStates = function(state, color) {
      var states = [];
      var moves;

      for(var i = 0; i < 8; i++) {
        for(var j = 0; j < 8; j++) {
          if (ChessAI.Color.getFromPiece(state[i][j]) == color) {
            moves = self.getMovesForSquare(state, i, j);
          }
          else {
            moves = [];
          }
          for(var k = 0; k < moves.length; k++) {
            var newState = ChessAI.Lib.copy(state);
            newState[moves[k].endRow][moves[k].endCol] = newState[moves[k].startRow][moves[k].startCol];
            newState[moves[k].startRow][moves[k].startCol] = P.Empty;
            states.push(new ChessAI.State(newState, 0));
          }
        }
      }

      return states;
    }

    /**
     * Determine if the attacker can capture the target piece.
     *
     * @param  {ChessAI.Piece} attacker
     * @param  {ChessAI.Piece} target
     * @return {bool}
     */
    var canCapture = function(attacker, target) {
      if (!attacker)
        return false;

      if (ChessAI.Color.getFromPiece(attacker) !=  ChessAI.Color.getFromPiece(target)
          && target != P.WhiteKing && target != P.BlackKing) {
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

    /**
     * Check if the king of the specified player is in check.
     * The technique is similar to finding all moves for all pieces,
     * with some efficiencies.
     * @todo More rules can be added to avoid testing impossible threats
     *
     * @param  {Array} state  8x8 array of board
     * @param  {ChessAI.Color} color
     *
     * @return {bool}
     */
    this.inCheck = function(state, color) {
      var king = (color == ChessAI.Color.White) ? P.WhiteKing : P.BlackKing;
      var kingPosition = null;

      for(var i = 0; i < 8; i++) {
        for(var j = 0; j < 8; j++) {
          if (state[i][j] == king) {
            kingPosition = [i, j];
            break;
          }
        }
        if (kingPosition)
          break;
      }

      var piece;
      var directions = [];
      var moveType;

      for(var row = 0; row < 8; row++) {
        for(var col = 0; col < 8; col++) {
          piece = state[row][col];
          if (piece == P.Empty || ChessAI.Color.getFromPiece(piece) == color) {
            continue;
          }
          switch(piece) {
            case P.BlackQueen:
            case P.WhiteQueen:

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
                  if (samePosition(kingPosition, [row + (directions[i][0] * j), col + (directions[i][1] * j)])) {
                    return true;
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
                if (samePosition(kingPosition, [row + offsets[i][0], col + offsets[i][1]])) {
                  return true;
                }
              }
              break;

            case P.BlackKing:
            case P.WhiteKing:
              for(var i = -1; i < 2; i++) {
                for(var j = -1; j < 2; j++) {
                  if (i == 0 && i == 0)
                    continue;
                  if (samePosition(kingPosition, [row + i, col + j])) {
                    return true;
                  }
                }
              }
              break;

            case P.BlackPawn:
            case P.WhitePawn:
              var dir = piece == P.BlackPawn ? 1 : -1;
              if (col > 0) {
                if (samePosition(kingPosition, [row+dir, col-1])) {
                  return true;
                }
              }
              if (col < 7) {
                if (samePosition(kingPosition, [row+dir, col+1])) {
                  return true;
                }
              }
              break;
          }
        }
      }

      return false;
    }

    var samePosition = function(a, b) {
      return a[0] == b[0] && a[1] == b[1];
    }

    return this.init();
  };
})(jQuery);
