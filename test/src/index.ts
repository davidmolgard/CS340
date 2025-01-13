type color = "Black" | "White"
type file = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H"
type rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
type piece = "Pawn" | "Knight" | "Bishop" | "Rook" | "Queen" | "King"

class Position {
  public constructor(private file: file, private rank: rank) { }

  public distanceFrom(position: Position): {rank: number, file: number} {
    return {rank: Math.abs(this.rank - position.rank), file: Math.abs(this.file.charCodeAt(0) - position.file.charCodeAt(0))}
  }
}