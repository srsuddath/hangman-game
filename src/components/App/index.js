import React, { Component } from 'react';
import logo from './logo.svg';
import './styles.css';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      fetched: false,
      hint: undefined,
      challenge: [],
      challengeSolution: [],
      guessedCorrectLetters: [],
      guessedIncorrectLetters: [],
      livesRemaining: 5,
      puzzleSolved: false,

    };
  };
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (event) => {
    // Guess if the user hits enter
    if (event.keyCode === 13) {
      this.guess();
      return;
    }
    if (event.keyCode > 64 && event.keyCode < 91) {
      document.getElementById('guessBox').value = event.key.toUpperCase();
    }
    if (event.keyCode > 47 && event.keyCode < 58) {
      document.getElementById('guessBox').value = event.key;
    }
    document.getElementById('guessBox').focus();
  };

  generateChallengeDisplay = (hint, challengeSolution) => {

    challengeSolution = challengeSolution.toUpperCase();
    challengeSolution = challengeSolution.split('');
    let challenge = challengeSolution.map(letter => letter.replace(/[A-z0-9]/g, '_'));

    this.setState({ hint, challengeSolution, challenge });
  };

  generatePuzzle = async () => {
    const { fetching } = this.state;

    // Escape early if we are already fetching a random joke.
    if (fetching) {
      return;
    }
    // Turn on fetching state.
    this.setState({ fetching: true });

    try {
      const rawResponse = await fetch('https://us-central1-dadsofunny.cloudfunctions.net/DadJokes/random/jokes');
      const parsedResponse = await rawResponse.json();
      this.generateChallengeDisplay(parsedResponse.setup, parsedResponse.punchline);
      this.setState({ fetching: false, puzzleSolved: false });

    } catch (error) {
      console.error('Error fetching dad joke', error);
      this.setState({ fetching: false, puzzleSolved: false });
    }
  };

  checkForWin = () => {
    const { challenge, challengeSolution } = this.state;
    if (challenge.join('') === challengeSolution.join('')) {
      this.setState({ puzzleSolved: true })
      console.log('SOLVED IT')
    }
  }


  guess = () => {
    const { challenge, challengeSolution, guessedCorrectLetters, guessedIncorrectLetters, livesRemaining } = this.state;
    const guess = document.getElementById('guessBox').value.toUpperCase();

    let guessIsCorrect = false;

    challengeSolution.forEach((letter, index) => {
      if (guess === letter) {
        challenge[index] = challengeSolution[index];
        guessIsCorrect = true;
      }
    });

    if (guessIsCorrect) {
      guessedCorrectLetters.push(guess);
    }
    else {
      guessedIncorrectLetters.push(guess);
      const currentLivesRemaining = livesRemaining - 1;
      this.setState({ livesRemaining: currentLivesRemaining })
    }

    document.getElementById('guessBox').value = '';

    this.checkForWin();

    this.setState({ challenge });

  }

  deriveButtonText = () => {
    const { puzzleSolved, hint } = this.state;
    if (puzzleSolved) {
      return 'Gimme the next puzzle';
    }
    if (hint) {
      return 'I\'m stuck, lets try another';
    }
    return 'Generate a puzzle';
  }

  render() {
    const { hint, challenge, puzzleSolved } = this.state;

    return (
      <div className='app'>
        <h1 className='victorySign'>{puzzleSolved ? 'YOU SOLVED THE PUZZLE!' : ''}</h1>

        <div className='puzzle'>
          <h2>{challenge.map((letter, index) => {
            if (letter === ' ') {
              return <span className='space' key={letter + index}>{letter}</span>;
            }
            if (letter === ',' || letter === '\'' || letter === ':' ||
              letter === ';' || letter === '.' || letter === '!' || letter === '?') {
              return <span className='punctuation' key={letter + index}>{letter}</span>;
            }
            return <span className='letter' key={letter + index}>{letter}</span>;
          })}</h2>

          <h3>{hint || 'WELCOME TO THE HANGIEST OF MANS'}</h3>
        </div>

        <div className='inputs'>

          <input type='text' maxLength='1' id='guessBox' />
          <button onClick={this.guess}
            type='button'>Guess!
            </button>

          <br />
          <br />

          <button onClick={this.generatePuzzle} type='button' id="puzzleGeneratorButton">
            {this.deriveButtonText()}
          </button>
        </div>

      </div >
    );
  }
}

export default App;
