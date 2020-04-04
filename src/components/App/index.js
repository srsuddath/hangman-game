import React, { Component } from 'react';
//import logo from '../../assets/logo.svg'
import StickMan from '../StickMan';
import Scaffold from '../Scaffold';
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
      livesRemaining: 6,
      puzzleSolved: false,
      generated: false,
      guess: '',
      displayHead: false,
      displayBody: false,
      displayLeftArm: false,
      displayRightArm: false,
      displayLeftLeg: false,
      displayRightLeg: false,
      puzzleFailed: false,

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
    if (event.keyCode > 64 && event.keyCode < 91) {
      this.setState({ guess: event.key.toUpperCase() })
    }
    if (event.keyCode > 47 && event.keyCode < 58) {
      this.setState({ guess: event.key })
    }
  };


  generateChallengeDisplay = (hint, challengeSolution) => {

    challengeSolution = challengeSolution.toUpperCase();
    challengeSolution = challengeSolution.split('');
    let challenge = challengeSolution.map(letter => letter.replace(/[A-z0-9]/g, '_'));

    this.setState({ hint, challengeSolution, challenge, livesRemaining: 6, generated: true, fetching: false, puzzleSolved: false, puzzleFailed: false, guessedCorrectLetters: [], guessedIncorrectLetters: [] });
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

    } catch (error) {
      console.error('Error fetching dad joke', error);
      this.setState({ fetching: false, puzzleSolved: false });
    }
    this.setState({ displayHead: false, displayBody: false, displayLeftArm: false, displayRightArm: false, displayLeftLeg: false, displayRightLeg: false });
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
    if (livesRemaining === 6) {
      this.setState(
        {
          displayHead: false,
          displayBody: false,
          displayLeftArm: false,
          displayRightArm: false,
          displayLeftLeg: false,
          displayRightLeg: false,
        })
    }
    if (livesRemaining === 5) {
      this.setState(
        {
          displayHead: true,
          displayBody: false,
          displayLeftArm: false,
          displayRightArm: false,
          displayLeftLeg: false,
          displayRightLeg: false,
        })
    }
    if (livesRemaining === 4) {
      this.setState(
        {
          displayHead: true,
          displayBody: true,
          displayLeftArm: false,
          displayRightArm: false,
          displayLeftLeg: false,
          displayRightLeg: false,
        })
    }
    if (livesRemaining === 3) {
      this.setState(
        {
          displayHead: true,
          displayBody: true,
          displayLeftArm: true,
          displayRightArm: false,
          displayLeftLeg: false,
          displayRightLeg: false,
        })
    }
    if (livesRemaining === 2) {
      this.setState(
        {
          displayHead: true,
          displayBody: true,
          displayLeftArm: true,
          displayRightArm: true,
          displayLeftLeg: false,
          displayRightLeg: false,
        })
    }
    if (livesRemaining === 1) {
      this.setState(
        {
          displayHead: true,
          displayBody: true,
          displayLeftArm: true,
          displayRightArm: true,
          displayLeftLeg: true,
          displayRightLeg: false,
        })
    }
    if (livesRemaining >= 1) {
      return;
    }
    this.setState({ challenge: challengeSolution, livesRemaining: 0, generated: false, displayHead: true, displayBody: true, isplayLeftArm: true, displayRightArm: true, displayLeftLeg: true, displayRightLeg: true, puzzleFailed: true })
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
      console.log('Repeated guesses are not allowed!');
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
    const { puzzleSolved, hint, fetching } = this.state;
    if (fetching) {
      return 'Fetching, Please Wait.....'
    }
    if (puzzleSolved) {
      return 'Gimme the next puzzle';
    }
    if (hint) {
      return 'I\'m stuck, lets try another';
    }
    return 'LET\'S DO THIS';
  }


  handleButtonClick = (letter) => {
    this.setState({ guess: letter }, this.guess);
  }


  deriveLifeCounterText = () => {
    const { livesRemaining } = this.state;

    if (livesRemaining > 1) {
      return `You have ${livesRemaining} lives remaining`;
    }
    if (livesRemaining === 1) {
      return 'You have 1 life remaining';
    }
    return 'You have FAILED';
  }


  deriveButtonClass = (letter) => {
    const { guessedIncorrectLetters, guessedCorrectLetters } = this.state;
    if (guessedCorrectLetters.includes(letter)) {
      return 'correct-guess-button';
    }
    if (guessedIncorrectLetters.includes(letter)) {
      return 'incorrect-guess-button';
    }
    return 'unguessedButton';
  }


  deriveChallengeDisplay = (challenge) => {
    return (challenge.map((letter, index) => {
      if (letter === ' ') {
        return <span className='space' key={letter + index}>{letter}</span>;
      }
      if (letter === ',' || letter === '\'' || letter === ':' ||
        letter === ';' || letter === '.' || letter === '!' || letter === '?') {
        return <span className='punctuation' key={letter + index}>{letter}</span>;
      }
      return <span className='letter' key={letter + index}>{letter}</span>;
    })
    )
  }

  render() {
    const { hint, challenge, puzzleSolved, guessedCorrectLetters, guessedIncorrectLetters, displayHead, displayBody, displayLeftArm, displayRightArm, displayLeftLeg, displayRightLeg, puzzleFailed, fetching } = this.state;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '1234567890';

    return (
      <div className='app' >

        <Scaffold>
          <StickMan
            displayHead={displayHead}
            displayBody={displayBody}
            displayLeftArm={displayLeftArm}
            displayRightArm={displayRightArm}
            displayLeftLeg={displayLeftLeg}
            displayRightLeg={displayRightLeg} />
        </Scaffold>

        {puzzleSolved &&
          <h1
            className='victorySign'
          >
            YOU SOLVED THE PUZZLE!
          </h1>}

        {hint && !puzzleSolved &&
          <h3
            className='lifeCounter'
          >
            {this.deriveLifeCounterText()}
          </h3>}

        {!puzzleSolved && <div className='puzzle'>
          {hint &&
            <h2>
              {this.deriveChallengeDisplay(challenge)}
            </h2>}

          <h3>{hint || 'WELCOME TO THE MOST DAD JOKED OF HANGMANS'}</h3>
        </div>}

        {puzzleSolved && <div className='puzzle'>
          <h3>{hint}</h3>
          <h2>
            {this.deriveChallengeDisplay(challenge)}
          </h2>
          <br />
        </div>}

        <div className='inputs'>

          {hint && <div>
            {alphabet.split('').map(letter => {
              return (
                <button
                  className={this.deriveButtonClass(letter)}
                  disabled={(guessedCorrectLetters.includes(letter) || guessedIncorrectLetters.includes(letter))}
                  key={letter}
                  onClick={() => this.handleButtonClick(letter)}
                  type='button'
                >
                  {letter}
                </button>
              );
            })}
          </div>}
          {hint && <div>{numbers.split('').map(number => {
            return (
              <button
                key={number}
                className={this.deriveButtonClass(number)}
                type='button'
                onClick={() => this.handleButtonClick(number)}
              >
                {number}
              </button>
            );
          })}
          </div>}

          {hint && !puzzleSolved && <br />}

          {hint && !puzzleSolved && !puzzleFailed && <div>
            <input
              type='text'
              maxLength='1'
              value={this.state.guess}
              onChange={this.onGuessChange}
              placeholder='Guess Here...'
            />
            <button
              onClick={this.guess}
              type='button'
            >
              Guess!
            </button>
          </div>}

          {hint && <br />}

          <button
            className={hint ? '' : 'bigButton'}
            disabled={fetching}
            onClick={this.generatePuzzle}
            type='button'
          >
            {this.deriveButtonText()}
          </button>

        </div>

      </div>
    );
  }
}

export default App;
