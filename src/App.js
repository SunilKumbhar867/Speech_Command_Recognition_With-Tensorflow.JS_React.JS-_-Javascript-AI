import logo from './logo.svg';
import './App.css';

//0. import dependencies
import * as tf from '@tensorflow/tfjs';
import * as speech from '@tensorflow-models/speech-commands';
import { useEffect, useState, useRef } from 'react';


//4 . Draw ball
import { drawBall } from './utilities.js'




const App = () => {
  //create model and actions states 
  const [model, setModel] = useState(null);
  const [action, setAction] = useState(null);
  const [labels, setLabels] = useState(null);


  //6. Create Canvas Ref and x,y,r
  const canvasRef = useRef(null);
  const [x, setX] = useState(300);
  const [y, setY] = useState(300);
  const [r, setR] = useState(10);


  //create recoginzer
  const loadModel = async () => {
    const recognizer = await speech.create('BROWSER_FFT');
    console.log('model loaded');
    await recognizer.ensureModelLoaded();
    console.log(recognizer.wordLabels());
    /**
     * Output of this are all the command
     * [
    "_background_noise_",
    "_unknown_",
    "down",
    "eight",
    "five",
    "four",
    "go",
    "left",
    "nine",
    "no",
    "one",
    "right",
    "seven",
    "six",
    "stop",
    "three",
    "two",
    "up",
    "yes",
    "zero"
    ]
     */

    setModel(recognizer);   //setting recoginzer to model.
    setLabels(recognizer.wordLabels()) //setting labels to recoginzer will be set the output of above array.

  }

  useEffect(() => {
    loadModel()
  }, []);

  //listen to action 
  function agrMax(arr) {
    return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
  }

  // 10e3 = 10 sec 
  const recoginzeCommands = async () => {
    console.log('listing to commands');
    model.listen((result) => {
      console.log(result);
      setAction(labels[agrMax(Object.values(result.scores))]);
      console.log(action);
    },
      {
        includeSpectogram: true,
        probabilityThreshold: 0.7
      }
    );
    //setTimeout(() => model.stopListening(), 10e3);
  };

  //7.update ball state

  const numberMap = {
    "zero": 0,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9
  }

  useEffect(() => {
    //update x and y 
    const update =
      action === "up" ? setY(y - 10) :
        action === "down" ? setY(y + 10) :
          action === "left" ? setX(x - 10) :
            action === "right" ? setX(x + 10) :
              " ";

    //update r 

    if (Object.keys(numberMap).includes(action)) {
      setR(10 * numberMap[action]);
    }

    //canvas draw
    canvasRef.current.width = 600;
    canvasRef.current.height = 600;
    const ctx = canvasRef.current.getContext('2d');
    console.log(x, y, r);
    drawBall(ctx, x, y, r);
    setAction('base');
  }, [action]);

  return (
    <div className="App">
      <header className="App-header">
        {/** 5.setup Canvas */}
        <canvas
          ref={canvasRef}

          style={
            {
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: 'center',
              zIndex: 9,
              width: 640,
              height: 640
            }
          }

        />


        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}

        {/** 4. Display command to the screen*/}

        <button onClick={recoginzeCommands}>Command</button>

        {action ? <div>{action}</div> : <div>No Action Needed</div>}
      </header>
    </div>
  );
}

export default App;
