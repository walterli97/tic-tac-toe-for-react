import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// controlled component -> function component
function Square(props) {
  return (
    <button 
      className={props.winner ? "winnersquare" : "square"} 
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

// controlled component
class Board extends React.Component {
  renderSquare(i) {
    let winner = false;
    if (this.props.result && this.props.result.includes(i))
      winner = true;
    return (
      <Square
        key={i}
        value={this.props.squares[i]} 
        winner={winner}
        onClick={() => this.props.onClick(i)} 
      />
    );
  }

  render() {
    return (
      <div>
        {[...Array(3)].map((element, i) => (
          <div key={i} className="board-row">
            {[...Array(3)].map((element, j) => (
              this.renderSquare(i*3 + j)
            ))}
          </div>
        ))}
      </div>
    );
  }
}


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        index: null,
      }],
      xIsNext: true,
      stepNumber: 0,
      winner: null,
      isDescend: false,
      result: null,
    }
  }

  handleClick(i) {
    // immutable copy of change
    let squares =  this.state.history.slice(-1).pop().squares.slice();
    // for a new click, check exist board
    // if a exist winner or exist filled, invalid click
    if (this.state.winner || squares[i])
      return;
    
    // append states, re-render
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // parse winner
    let result = calculateWinner(squares);
    let winner;
    if (result)
      winner = squares[result[0]];
    else
      winner = null;

    this.setState({
      history: this.state.history.concat([{
        squares: squares,
        index: i,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: this.state.stepNumber+1,
      winner: winner,
      result: result,
    }, ()=>{
      console.log(this.state.history);
    });
  }

  // sync state based on step number
  jumpTo(move) {
    this.setState({
      stepNumber: move,
      xIsNext: (move % 2) === 0,
      history: this.state.history.slice(0, move+1),
      winner: (move === this.state.stepNumber) ? this.state.winner : null,
      result: (move === this.state.stepNumber) ? this.state.result : null,
    });
  }

  render() {
    const squares = this.state.history.slice(-1).pop().squares;

    // based on step number, show step status desc
    let moves = this.state.history.map((element, move) => {
      const desc = move ?
        'Go to move #' + move + ' row: ' + Math.floor(element.index/3) + ' col: ' + (element.index%3):
        'Go to game start';
      return (
        <li className="nostyle" key={move}>
          <button 
            className={move===this.state.stepNumber ? 'move-list-item-selected': ''}
            onClick={() => {this.jumpTo(move)}}
          >
            {desc}
          </button>
        </li>
      );
    });
    if (this.state.isDescend)
      moves = moves.reverse();

    // based on calculateWinner, show top status desc 
    let status;
    if (this.state.winner) {
      status = 'Winner: ' + this.state.winner;
    } else if (this.state.stepNumber === 9) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={squares} 
            result={this.state.result}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <label>descending order: </label>
            <input type="checkbox" onClick={() => {
              this.setState({
                isDescend: !this.state.isDescend,
              });
            }}/>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i=0; i<lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return [a, b, c];
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


