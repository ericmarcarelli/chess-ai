(function($) {
  ChessAI.Modules.States = function() {
    var self = this;
    var P = ChessAI.Piece;
    var MoveType = { Invalid : 0, Move : 1, Capture : 2 };

    // Piece values are based on generally accepted relative values of the pieces.
    var PieceValue = [];
    PieceValue[P.Empty] = 0;
    PieceValue[P.BlackPawn] = PieceValue[P.WhitePawn] = 75;
    PieceValue[P.BlackKnight] = PieceValue[P.WhiteKnight] = 300;
    PieceValue[P.BlackBishop] = PieceValue[P.WhiteBishop] = 300;
    PieceValue[P.BlackRook] = PieceValue[P.WhiteRook] = 500;
    PieceValue[P.BlackKing] = PieceValue[P.WhiteKing] = 400;
    PieceValue[P.BlackQueen] = PieceValue[P.WhiteQueen] = 900;

    this.CheckmateRating = -1000000;
    this.DrawRating = -100000;

    this.init = function() {
      return this;
    };

    /**
     * Construct and search game tree to select the best available move.
     *
     * @param  {ChessAI.State} state
     * @param  {ChessAI.Color} startColor
     * @param  {ChessAI.Color} currColor
     * @param  {int} ply
     * @return {ChessAI.Move}
     */
    this.getBestMove = function(state, startColor, currColor, ply) {
    	var best = new ChessAI.State(), nextBest = null, tempRating = 0;
      var nextColor = ChessAI.Color.flipColor(currColor);
      var moves = this.getAllStates(state.board, currColor, ply == 1);

      if (moves.length == 0) {
        best.rating = self.inCheck(state.board, currColor) ? self.CheckmateRating : self.DrawRating;
      }

      for(var i = 0; i < moves.length; i++) {
        if (ply > 0) {
          nextBest = this.getBestMove(moves[i], startColor, nextColor, ply - 1);
          moves[i].rating = -nextBest.rating;
        }
        else {
          rateState(moves[i], currColor);
        }

        if (i == 0 || moves[i].rating > best.rating) {
          best = moves[i];
        }
      }

    	return best;

    };

    /**
     * Get array of legal moves for a square.
     * @todo currently missing moves such as castling and en passant capture
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
              if (i == 0 && j == 0)
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
          if (row == initialRow && state[row+dir][col] == P.Empty && state[row+(dir*2)][col] == P.Empty) {
            moves.push(new ChessAI.Move(piece, row, col, row+(dir*2), col));
          }
          if (row+dir >= 0 && row+dir < 8) {
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
     * @param  {bool} limitToCurrBest - if true, do not add states that aren't
     *                                  better than the current best rating
     * @return {Array} States
     */
    this.getAllStates = function(state, color, limitToCurrBest) {
      var states = [], moves, currBest = self.CheckmateRating;

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

            for (var l = 0; l < 8; l++) {
              if (newState[0][l] == P.WhitePawn) {
                newState[0][l] = P.WhiteQueen;
              }
              else if (newState[7][l] == P.BlackPawn) {
                newState[7][l] = P.BlackQueen;
              }
            }

            var s = new ChessAI.State(newState, 0);
            if (limitToCurrBest) {
              rateState(s, color);
              if (s.rating > currBest) {
                currBest = s.rating;
              }
              else {
                continue;
              }
            }
            states.push(s);
          }
        }
      }

      return states;
    }

    /**
     * Calculates rating for a state from color's perspective.
     * @param  {ChessAI.State} state
     * @param  {ChessAI.Color} color
     */
    var rateState = function(state, color) {
      var mult = [], rating = 0;
      mult[color] = 1;
      mult[ChessAI.Color.flipColor(color)] = -1;

      for(var i = 0; i < 8; i++) {
        for(var j = 0; j < 8; j++) {
          if (state.board[i][j] != P.Empty) {
            rating = (mult[ChessAI.Color.getFromPiece(state.board[i][j])] * PieceValue[state.board[i][j]]);
            // increase value if controlling the center
            if (i > 1 && i < 6 && j > 1 && j < 6) {
              rating *= 1.2;
            }
            if (state.board[i][j] == P.BlackPawn) {
              rating += i*25;
            }
            else if (state.board[i][j] == P.WhitePawn) {
              rating += (7-i) * 25;
            }
            state.rating += rating;
          }
        }
      }
    };

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
          directions = [];
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
                  if (i == 0 && j == 0)
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
