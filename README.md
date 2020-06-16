## This project is followed by react official tutorial
https://reactjs.org/tutorial/tutorial.html

## How to Run:
```
npm start
```

and go to localhost:3000 to view it in the browser

## With further features implemented:

 - ### Display the location for each move in the format (col, row) in the move history list.
first add index in the history:
```javascript
history: [{
    squares: Array(9).fill(null),
    index: null,
}],
```

second set index in handleClick:
```javascript
this.setState({
    history: this.state.history.concat([{
    squares: squares,
    index: i,
    }]),
});
```

third in Game render() change the desc of move:
```javascript
const desc = move ?
    'Go to move #' + move + ' row: ' + Math.floor(element.index/3) + ' col: ' + (element.index%3):
    'Go to game start';
```


 - ### Bold the currently selected item in the move list.
 first add one css rule for bold:
 ```css
 .move-list-item-selected{
    font-weight: bold;
}
 ```

 second in Game render() if the button shows current step, change the css className:
 ```javascript
 <button 
    className={move===this.state.stepNumber ? 'move-list-item-selected': ''}
    onClick={() => {this.jumpTo(move)}}
>
    {desc}
</button>
 ```


 - ### Rewrite Board to use two loops to make the squares instead of hardcoding them.
 as shown below in Board render():
 ```javascript
render() {
    return (
      <div>
        {[...Array(3)].map((element, i) => {
          return (
            <div key={i} className="board-row">
              {[...Array(3)].map((element, j) => {
                return this.renderSquare(i*3 + j);
              })}
            </div>
          );
        })}
      </div>
    );
}
 ```


 - ### Add a toggle button that lets you sort the moves in either ascending or descending order.
 use input checkbox as toggle button:
 ```javascript
 <div>
    <label>descending order: </label>
    <input type="checkbox" onClick={() => {
        this.setState({
        isDescend: !this.state.isDescend,
        });
    }}/>
</div>
 ``` 

 and set a state isDescend initialized as false:
 ```javascript
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
    }
}
 ```

 after constructing moves, toggle it:
 ```javascript
if (this.state.isDescend)
    moves = moves.reverse();
 ```


  - ### When someone wins, highlight the three squares that caused the win.
first change calculateWinner() to return winners:
```javascript
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
```

second change the calling logic in handleClick():
```javascript
let result = calculateWinner(squares);
let winner;
if (result)
    winner = squares[result[0]];
else
    winner = null;
```

third define a result state in Game:
```javascript
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
```

fourth update result in handleClick(i) and jumpTo():
```javascript
// handleClick(i): 
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

// jumpTo(move):
this.setState({
    stepNumber: move,
    xIsNext: (move % 2) === 0,
    history: this.state.history.slice(0, move+1),
    winner: (move === this.state.stepNumber) ? this.state.winner : null,
    result: (move === this.state.stepNumber) ? this.state.result : null,
});
```

fifth passing result to Board:
```javascript
<Board 
    squares={squares} 
    result={this.state.result}
    onClick={(i) => this.handleClick(i)}
/>
```

sixth filtering winner from result in Board renderSquare(i):
```javascript
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
```

seventh show corresponding css className in Square:
```javascript
<button 
    className={props.winner ? "winnersquare" : "square"} 
    onClick={props.onClick}
>
    {props.value}
</button>
```


 - ### When no one wins, display a message about the result being a draw.
 change status checking in Game render():
 ```javascript
let status;
if (this.state.winner) {
    status = 'Winner: ' + this.state.winner;
} else if (this.state.stepNumber === 9) {
    status = 'Draw';
} else {
    status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
}
 ```
