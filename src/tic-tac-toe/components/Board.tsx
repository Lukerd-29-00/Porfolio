import { useState } from "react";
import { useRows } from "../hooks/useRows";

interface empty {

}

function isValidTurn(turn: string):turn is "X" | "O"{
    return turn == "X" || turn == "O";
}

export function Board(props: empty): JSX.Element{
    const [rows, updateSquare] = useRows();
    const [turn, changeTurn] = useState("X");
    const [winner, setWinner] = useState("nobody");
    const newWinner = Winner(rows);
    if(newWinner != null && winner == "nobody"){
        setWinner(newWinner);
    }

    return(
        <>
        <div className="game-info">
            {winner == "nobody" ? <p>{turn}'s turn</p> : winner == "tie" ? <p>Tie!</p> : <p>Winner: {winner}</p>}
        </div>
        <div className="game-board">
            {rows.map((row: Array<"X" | "O" | null>,i: number, array: Array<Array<"X" | "O" | null>>) => {
                return <div className="board-row">
                    {array[i].map((value: "X" | "O" | null,j: number) => {
                        if(isValidTurn(turn)){
                            return <button key={Math.floor(i/3) + j % 3} onClick={() => {updateSquare(j,i,turn); changeTurn(turn == "X" ? "O" : "X")}} disabled={winner != "nobody"}>{value}</button>
                        }
                        else{
                            throw Error(`Invalid player ${turn}`);
                        }
                    })}
                </div>
            })}
        </div>
        </>


    )
}

function getSquare(board: Array<Array<"X" | "O" | null>>,i: number): "X" | "O" | null{
    return board[Math.floor(i/3)][i % 3]
}

interface Counter {
    X: number,
    O: number,
    empty: number
}

function Winner(board: Array<Array<"X" | "O" | null>>): "X" | "O" | "tie" | null{
    const victory_triplets = [
        [0,1,2],
        [0,3,6],
        [0,4,8],
        [1,4,7],
        [2,5,8],
        [3,4,5],
        [6,4,2],
        [6,7,8]
    ]
    let tie = true;
    for(let win = 0;win < victory_triplets.length;win++){
        let counter: Counter = {X: 0,O: 0,empty: 0}
        let cmp = getSquare(board,victory_triplets[win][0])
        for(let i = 0;i < 3;i++){
            let square = getSquare(board,victory_triplets[win][i]);
            if(square == null){
                counter.empty++;
            }
            else if(square == "X"){
                counter.X++;
            }
            else{
                counter.O++;
            }

        }
        if(counter.X == 3 || counter.O == 3){
            return cmp;
        }
        if((counter.X + counter.empty == 3) || (counter.O + counter.empty == 3)){
            tie = false;
        }
    }
    return tie ? "tie" : null;
}