import React, { Component } from 'react';
//import logo from '../../assets/logo.svg'
// import StickMan from './StickMan';
import './styles.css';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      hint: undefined,
      challenge: [],
      challengeSolution: [],
      guessedCorrectLetters: [],
      guessedIncorrectLetters: [],
      livesRemaining: 5,
      puzzleSolved: false,
      guess: '',

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
      event.preventDefault();
      this.guess();
      return;
    }
  };

  generateChallengeDisplay = (hint, challengeSolution) => {

    challengeSolution = challengeSolution.toUpperCase();
    challengeSolution = challengeSolution.split('');
    let challenge = challengeSolution.map(letter => letter.replace(/[A-z0-9]/g, '_'));

    this.setState({ hint, challengeSolution, challenge, livesRemaining: 5 });
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
  /*
    checkForLoss = (livesRemaining) => {
      const { challenge, challengeSolution, hint, guessedCorrectLetters, guessedIncorrectLetters } = this.state;
  
      if (livesRemaining > 1) {
  
      }
      this.setState({ livesRemaining })
    }
    */


  guess = () => {
    const { challenge, challengeSolution, guessedCorrectLetters, guessedIncorrectLetters, livesRemaining, guess } = this.state;

    let guessIsCorrect = false;

    challengeSolution.forEach((letter, index) => {
      if (guess === letter) {
        challenge[index] = challengeSolution[index];
        guessIsCorrect = true;
      }
    });

    if (guessIsCorrect) {
      this.setState({ guessedCorrectLetters: [...guessedCorrectLetters, guess], challenge, guess: '' })
      this.checkForWin();
      return;
    }
    this.setState({ livesRemaining: livesRemaining - 1, guessedIncorrectLetters: [...guessedIncorrectLetters, guess], challenge, guess: '' });
    //this.checkForLoss(currentLivesRemaining);



  }

  onGuessChange = (event) => {
    this.setState({ guess: event.target.value.toUpperCase() });
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
    const { hint, challenge, puzzleSolved, guessedCorrectLetters, guessedIncorrectLetters, livesRemaining } = this.state;
    //let blah = 'abcd';
    //blah.split('').map((letter, index) => {
    // <button></button>
    // })
    return (
      <div className='app' >
        {/* <img src={logo} alt='a dude having a bad day because he is bad at this game' /> */}
        {/*<StickMan bodyPartsToShow, mood />*/}
        {/* {
          head: true,
          leftLeg: false,
        } */}

        <h1 className='victorySign' > {puzzleSolved ? 'YOU SOLVED THE PUZZLE!' : ''}</h1>
        <h2 className='lifeCounter'>{((livesRemaining > 0) && hint) ? `You have ${livesRemaining} tries remaining` : ''}</h2>

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

          <input className='guessBox' type='text' maxLength='1' value={this.state.guess} onChange={this.onGuessChange} placeholder='Guess Here' />
          <button onClick={this.guess}
            type='button'>Guess!
            </button>

          <br />
          <br />

          <button onClick={this.generatePuzzle} type='button' id="puzzleGeneratorButton">
            {this.deriveButtonText()}
          </button>

          <h3 className='correctGuesses'><span className="some-class">Correct Guesses:</span> {guessedCorrectLetters.join(',')}</h3>
          <h3 className='incorrectGuesses' >{guessedIncorrectLetters.join(',')}</h3>
        </div>

      </div >
    );
  }
}

export default App;
