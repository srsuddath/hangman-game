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
      generated: false,
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

    this.setState({ hint, challengeSolution, challenge, livesRemaining: 5, generated: true });
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
      this.setState({ fetching: false, puzzleSolved: false, guessedCorrectLetters: [], guessedIncorrectLetters: [] });

    } catch (error) {
      console.error('Error fetching dad joke', error);
      this.setState({ fetching: false, puzzleSolved: false });
    }
  };

  checkForWin = () => {
    const { challenge, challengeSolution } = this.state;
    if (challenge.join('') === challengeSolution.join('')) {
      this.setState({ puzzleSolved: true, generated: false })
      console.log('SOLVED IT')
    }
  }

  checkForLoss = () => {
    const { challengeSolution, livesRemaining } = this.state;

    if (livesRemaining >= 1) {
      return;
    }
    this.setState({ challenge: challengeSolution, livesRemaining: 0, guessedIncorrectLetters: [], guessedCorrectLetters: [], generated: false })
  }



  guess = () => {
    const { challenge, challengeSolution, guessedCorrectLetters, guessedIncorrectLetters, livesRemaining, guess, generated } = this.state;
    const punct = [',', '?', '.', '\'', '"', ';', ':',];

    if (!generated) {
      return;
    }
    if (guess === '') {
      console.log('Empty Guesses are ignored');
      return;
    }
    if (guessedCorrectLetters.includes(guess) || guessedIncorrectLetters.includes(guess)) {
      alert('Repeated guesses are not allowed!');
      this.setState({ guess: '' });
      return;
    }
    if (punct.includes(guess)) {
      this.setState({ guess: '' });
      return;
    }
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
    this.setState({ livesRemaining: livesRemaining - 1, guessedIncorrectLetters: [...guessedIncorrectLetters, guess], challenge, guess: '' }, () => this.checkForLoss());

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

  handleButtonClick = (letter) => {
    this.setState({ guess: letter },
      () => this.guess());
  }


  deriveLifeCounterText = () => {
    const { livesRemaining, hint } = this.state;
    if (hint) {
      if (livesRemaining > 1) {
        return `You have ${livesRemaining} lives remaining`;
      }
      if (livesRemaining === 1) {
        return 'You have 1 life remaining';
      }
      return 'You have FAILED';
    }
    return '';
  }
  deriveButtonClass = (letter) => {
    const { guessedIncorrectLetters, guessedCorrectLetters } = this.state;
    if (guessedCorrectLetters.includes(letter)) {
      return 'correctGuessButton';
    }
    if (guessedIncorrectLetters.includes(letter)) {
      return 'incorrectGuessButton';
    }
    return 'unguessedButton';
  }

  render() {
    const { hint, challenge, puzzleSolved } = this.state;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '1234567890';

    return (
      <div className='app' >


        {/*<StickMan bodyPartsToShow, mood />*/}
        {/* {
          head: true,
          leftLeg: false,
        } */}

        <h1 className='victorySign' > {puzzleSolved ? 'YOU SOLVED THE PUZZLE!' : ''}</h1>
        <h2 className='lifeCounter'>{this.deriveLifeCounterText()}</h2>

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

          <h3>{hint || 'WELCOME TO THE MOST DAD JOKED OF HANGMANS'}</h3>
        </div>

        <div className='inputs'>
          <div>
            <input className={hint ? 'guessBox' : 'hidden'} type='text' maxLength='1' value={this.state.guess} onChange={this.onGuessChange} placeholder='Guess Here' />
            <button className={hint ? '' : 'hidden'} onClick={this.guess}
              type='button'>Guess!
            </button>
          </div>
          <br />

          <div>{alphabet.split('').map(letter => {
            return <button className={hint ? this.deriveButtonClass(letter) : 'hidden'} type='button' onClick={() => this.handleButtonClick(letter)} > {letter}</button>
          })}
          </div>
          <div>{numbers.split('').map(number => {
            return <button className={hint ? this.deriveButtonClass(number) : 'hidden'} type='button' onClick={() => this.handleButtonClick(number)} > {number}</button>
          })}
          </div>

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
