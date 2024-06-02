import React, { useState, useEffect } from 'react';
import './HangmanGame.css';
import yesAudio from '../assets/yes.wav';
import noAudio from '../assets/no.wav';
import s0 from '../assets/img/s0.jpg';
import s1 from '../assets/img/s1.jpg';
import s2 from '../assets/img/s2.jpg';
import s3 from '../assets/img/s3.jpg';
import s4 from '../assets/img/s4.jpg';
import s5 from '../assets/img/s5.jpg';
import s6 from '../assets/img/s6.jpg';
import s7 from '../assets/img/s7.jpg';
import s8 from '../assets/img/s8.jpg';
import s9 from '../assets/img/s9.jpg';

const letters = [
  "A", "Ą", "B", "C", "Ć", "D", "E", "Ę", "F", "G", "H", "I", "J", "K", "L", "Ł", "M", "N", "Ń", "O", "Ó", "P", "Q", "R", "S", "Ś", "T", "U", "V", "W", "X", "Y", "Z", "Ż", "Ź"
];

const images = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9];

const HangmanGame = () => {
  const [initialPhrase, setInitialPhrase] = useState("");
  const [phrase, setPhrase] = useState("");
  const [maskedPhrase, setMaskedPhrase] = useState("");
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [congratulationsShown, setCongratulationsShown] = useState(false); // Added state
  const yes = new Audio(yesAudio);
  const no = new Audio(noAudio);

  useEffect(() => {
    if (gameStarted) {
      let initialMaskedPhrase = "";
      for (let i = 0; i < phrase.length; i++) {
        initialMaskedPhrase += phrase.charAt(i) === " " ? " " : "-";
      }
      setMaskedPhrase(initialMaskedPhrase);
    }
  }, [phrase, gameStarted]);

  const startGame = () => {
    const uppercasePhrase = initialPhrase.toUpperCase();
    setPhrase(uppercasePhrase);
    setGameStarted(true);
  };

  const checkLetter = (index) => {
    if (congratulationsShown) return; // Prevent further interaction after showing congratulations
    let hit = false;
    let updatedMaskedPhrase = maskedPhrase.split('');

    for (let i = 0; i < phrase.length; i++) {
      if (phrase.charAt(i) === letters[index]) {
        updatedMaskedPhrase[i] = letters[index];
        hit = true;
      }
    }

    setMaskedPhrase(updatedMaskedPhrase.join(''));

    if (hit) {
      yes.play();
      updateButtonStyle(index, true);
    } else {
      no.play();
      updateButtonStyle(index, false);
      setIncorrectGuesses(prev => prev + 1);
    }

    checkEndGame(updatedMaskedPhrase.join(''));
  };

  const updateButtonStyle = (index, hit) => {
    const button = document.getElementById(`letter${index}`);
    if (hit) {
      button.style.background = "#003300";
      button.style.color = "#00C000";
      button.style.border = "3px solid #00C000";
    } else {
      button.style.background = "#330000";
      button.style.color = "#C00000";
      button.style.border = "3px solid #C00000";
    }
    button.style.cursor = "default";
    button.onclick = null;
  };

  const checkEndGame = (updatedMaskedPhrase) => {
    if (phrase === updatedMaskedPhrase) {
      setCongratulationsShown(true); // Update state when the phrase is guessed correctly
      setGameOver(true);
    }
  
    if (incorrectGuesses >= 9) {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setInitialPhrase("");
    setPhrase("");
    setMaskedPhrase("");
    setIncorrectGuesses(0);
    setGameStarted(false);
    setGameOver(false);
    setCongratulationsShown(false); // Reset state
  };

  return (
    <div className="HangmanGame" id="hangman-game">
      <div id="container">
        {!gameStarted && !gameOver && !congratulationsShown ? (
          <div className="start-screen">
  <h1>Set the Phrase</h1>
  <input 
    type="text" 
    value={initialPhrase} 
    onChange={(e) => setInitialPhrase(e.target.value)} 
    placeholder="Enter the phrase..."
    className="input" // Adding the input class here
  />
<button 
  onClick={startGame} 
  className="button"
>
  Start Game
</button></div>
        ) : (
          <>
            <h1>Hangman Game</h1>
            <div id="game-area">
              <div id="phraseDisplay">
                {maskedPhrase.split('').map((char, index) => (
                  <span key={index} className="guessed-letter">
                    {char !== '-' ? char : ''}
                  </span>
                ))}
              </div>
              <div id="gallows">
                <img src={images[incorrectGuesses]} alt={`Hangman - ${incorrectGuesses} incorrect guesses`} />
              </div>
            </div>
            <div id="alphabet">
              {letters.map((letter, index) => (
                <div
                  key={index}
                  className="letter"
                  id={`letter${index}`}
                  onClick={() => checkLetter(index)}
                  style={{ cursor: 'pointer' }}
                >
                  {letter}
                </div>
              ))}
            </div>
          </>
        )}
        {gameOver && (
          <div id="status-bar">
            {phrase === maskedPhrase ? (
              <div className="congratulations">
                <h2>Congratulations!</h2>
                <p>You guessed the correct phrase: {phrase}</p>
              </div>
            ) : (
              <div className="game-over">
                <h2>Game Over!</h2>
                <p>The correct phrase was: {phrase}</p>
              </div>
            )}
            <button onClick={restartGame}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HangmanGame;
