import { useState } from 'react'
import './App.css'

// WINNING COMPOSICION
const WINNING_COMPS = [
  //FILAS
  [0,1,2],[3,4,5],[6,7,8],
  //COLUMNAS
  [0,3,6], [1,4,7],[2,5,8],
  // DIAGONAL
  [0,4,8], [2,4,6]
]

//Para crear nuevos arrays y simular que estamos limpianzo o reiniciando
// el juego
const INITIAL_STATE = new Array(9).fill("")

enum Player {
  X = "X",
  O = "O",
  DRAW = "EMPATE"
}

enum Status{
  Playing = "PLAYING",
  Draw = "DRAW",
  XWON = "XWON",
  OWON = "OWON",
  reset = "",
  Finished = "FINISHED"
}

function App() {

  // Estado de turno de player
  const [turn, setTurn] = useState<Player>(Player.X)
  // Estado de celdas
  const [cells, setCells] = useState<(Player | "" )[]>(INITIAL_STATE)
  // STATUS: EN QUE ESTADO ESTA EL JUEGO
  const [status, setStatus] = useState<Status>(Status.Playing)
  // contador de score
  const [scoreboard, setScoreboard] = 
  useState<Record<Player, number>>({[Player.X]: 0, [Player.O]: 0, [Player.DRAW]: 0 } )

  // funcion click
  const handleClick = (index: number) => {

    if(status !== Status.Playing) return

    //asigno en el index de cada elemento el turn actual y
    // si el campo esta vacio realizo las siguientes acciones:
    if(cells[index] === ""){

      //creo nuevo array para no mutar
      const draft = [...cells]
      draft[index] = turn

      const hasWon = WINNING_COMPS.some(comp => comp.every(cell => turn === draft[cell]))

      if(hasWon){
        setStatus(Status.Finished)
          setScoreboard(score => ({
            ...score,
            [turn]: score[turn] + 1
          }))
      }else if (!draft.some(cell => cell === "")) {
        setStatus(Status.Draw)
        setScoreboard(score => ({
          ...score,
          [Player.DRAW]: score[Player.DRAW] + 1
        }))
      }
      

      //setear el estado al hacer click pintará {X} o {O}
      setTurn( turn => turn === Player.X ? Player.O : Player.X)
      // setea el estado de cells para almacenar el turn actual 
      setCells(draft)
    }
    
  }

  // Funcion Reiniciar
  const handleReset = () =>{
    setCells(INITIAL_STATE)
    setStatus(Status.Playing)
  }
  
  

  return (
    <main>
      
      {status === Status.Playing && (
        <section className='score'>
          <p>Turno de {turn}</p>
          <p>PLAYER X GANO: {scoreboard[Player.X]}</p>
          <p>PLAYER O GANO: {scoreboard[Player.O]}</p>
          <p>EMPATARON: {scoreboard[Player.DRAW]}</p>
        </section>
      )}
      
      <div className="board">

        {cells.map((cell,index) => (
          <div 
          key={index}
          className="cell" 
          onClick={()=>handleClick(index)} 
          >
            {cell}
          </div>
        )) }
      </div>

      { status !== Status.Playing && (
        <section>
          <article role="alert">
            { status === Status.Draw && "Empate!" }
            { status === Status.Finished && `Gano ${turn === Player.O ? "X" : "O"}`}
          </article>
          <button onClick={handleReset}>Reiniciar</button>
        </section>
      
      )}
    </main>
  )
}

export default App
