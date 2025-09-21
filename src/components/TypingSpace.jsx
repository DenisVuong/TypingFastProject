import React, { useEffect, useRef, useState } from 'react';
import { Settings } from 'lucide-react';
import frenchWords from '../language/french.json';



const TypingSpace = () => {

    const [time, setTime] = useState(10); // Temps initial (60 secondes)
    const [displayedText, setDisplayedText] = useState("..."); // Deux premières lignes initiales
    const [isRunning, setIsRunning] = useState(false); // Jeu démarré ?
    const [currentIndex, setCurrentIndex] = useState(0); // Position dans le texte cible
    const [errorPerWord, setErrorPerWord] = useState(0); // Nombre erreur
    const [wpm, setWpm] = useState(0); // WPM à afficher à la fin
    const [accuracy, setAccuracy] = useState(100);
    const [initialTime,setInitialTime] = useState(10); // Temps initial pour le calcul du WPM
    const inputRef = useRef(); // référence à la balise input
    const timerRef = useRef(null); // référence pour le temps
    const hasStoppedRef = useRef(false); // évite les doubles arrêts
    const currentIndexRef = useRef(0); // snapshot indépendant du cycle de rendu
    const errorPerWordRef = useRef(0); // snapshot indépendant du cycle de rendu
    const [isDisabled,setIsDisabled] = useState(false);
    const [currentIsCorrect,setCurrentIsCorrect] = useState(true);
    const [textToCompare,setTextToCompare] = useState(displayedText.split(' ').filter(word => word.length > 0));




    const initializeGame = () => {
      // Arrête le timer s'il est en cours
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        hasStoppedRef.current = false;
        // Initialise à 0 les etats
        setTime(10);
        setErrorPerWord(0);
        errorPerWordRef.current = 0;
        inputRef.current.value = "";
        const baseText = generateText();
        setDisplayedText(baseText);
        setIsRunning(false);
        setCurrentIndex(0);
        currentIndexRef.current = 0;
        setWpm(0);
        setAccuracy(100);
        setInitialTime(10);
        setTextToCompare(baseText.split(' ').filter(word => word.length > 0));
        setIsDisabled(false);
        setCurrentIsCorrect(true);
        generateText();
    }
    
    const startTimer = () => {
      if (!isRunning && timerRef.current === null) {
          setIsRunning(true);
          timerRef.current = setInterval(() => {
              setTime((prev) => {
                  const newTime = prev - 1;
                  if (newTime <= 0) {
                    clearInterval(timerRef.current); 
                    timerRef.current = null;
                    stopTimer(newTime);
                }                
                  return newTime >= 0 ? newTime : 0; // Assure que time ne devient pas négatif
              });
          }, 1000);
      }
  };
  
    

  const stopTimer = (finalTime) => {
    if (hasStoppedRef.current) {
      return;
    }
    hasStoppedRef.current = true;
    if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }
    setIsRunning(false);
  
    // ⚡ Utilise les refs pour éviter les closures obsolètes
    const wordsTyped = currentIndexRef.current;
  
  
    calculateWPM(finalTime, wordsTyped); // <-- on envoie directement le nombre de mots
    setIsDisabled(true);
    inputRef.current.value = "";
  };
  
  

  const calculateWPM = (finalTime, wordsTyped) => {
    const errors = errorPerWordRef.current;
    const errorRate = wordsTyped > 0 ? errors / wordsTyped : 0;
    const effectiveWords = wordsTyped * (1 - errorRate);
    const minutes = (initialTime - finalTime) / 60;
  
    let WPM = effectiveWords > 0 && minutes > 0 ? effectiveWords / minutes : 0;
    const roundedWPM = Math.round(WPM);
    setWpm(roundedWPM);
  
  };
  

    const handleInputChange = (e) => {
      if (isRunning == false){

        if (inputRef.current.value == " "){
          inputRef.current.value = "";
        }

        else{
          startTimer();
        }
      }

      const actualInput = e.target.value;
      const cuttedWord = textToCompare[currentIndex].slice(0,actualInput.length);
      setCurrentIsCorrect(actualInput==cuttedWord);

      // regarde si dernier caractère est vide
      if (actualInput.length > 0 && actualInput[actualInput.length-1] == " "){
        //si erreur, error +1
        if (!(actualInput.replaceAll(" ", "") == cuttedWord)){
          setErrorPerWord((prev)=>{
            const next = prev + 1;
            errorPerWordRef.current = next;
            return next;
          })
        }
        
        //reintialise l'input
        inputRef.current.value = "";
        setCurrentIndex((prev)=>{
          const next = prev + 1;

          currentIndexRef.current = next;
          const words = next;
          const errors = errorPerWordRef.current; 
          const acc = words > 0 ? Math.max(0, Math.round(((words - errors) / words) * 100)) : 100;
          setAccuracy(acc);
          return next;
        });
        setCurrentIsCorrect(true);
      }
    }

    
    const outputWord = () => (
      <div className="flex flex-wrap">
          {textToCompare.map((word, index) => (
                <span
                    key={index}
                    className={`p-1 text-3xl ${
                      index < currentIndex ? 'text-[#1d2129]' : // Mots déjà tapés en couleur personnalisée
                      (currentIsCorrect==false && currentIndex==index) ? 'bg-red-600' : // Mot actuel incorrect en rouge
                      currentIndex === index ? 'bg-gray-500 rounded' : // Mot actuel en surbrillance
                      'text-inherit' // Mots non tapés en couleur normale
                    }`}
                >
                  {word}
              </span>
          ))}
      </div>
  );

    const resetGame = () => {
        initializeGame();
    }

    const generateText = () => {
      let frWordsList = frenchWords.words;      
      let listOfWords = [];

      for (let i = 0; i < 50; i++) {
        let word = frWordsList[Math.floor(Math.random() * frWordsList.length)];
        listOfWords.push(word);
      }


      let randomSentence = listOfWords.join(" ");

      return randomSentence;

    }        


    useEffect(()=> {
        initializeGame();
    }, [])

  return (
    <div>
  <div className="w-full max-w-[2000px] h-auto min-h-[300px] p-4 sm:p-6 bg-gray-800 rounded-xl shadow-lg mt-4 sm:mt-6 border border-gray-600 overflow-auto flex flex-col mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          {/* Stats */}
          <div className="flex space-x-4 sm:space-x-6 text-center">

          <div>
              <p className="text-lg sm:text-3xl font-bold">{time}</p>
              <p className="text-xs sm:text-xl text-gray-400">Time</p>
          </div>

            <div className={`flex space-x-4 sm:space-x-6 transition-all duration-800 ease-in-out ${isDisabled ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <div>
                <p className="text-lg sm:text-3xl font-bold">{wpm}</p>
                <p className="text-xs sm:text-xl text-gray-400">WPM</p>
              </div>
              <div> 
                <p className="text-lg sm:text-3xl font-bold">{accuracy}%</p>
                <p className="text-xs sm:text-xl text-gray-400">Accuracy</p>
              </div>
            </div>
            
            
          </div>

          {/* Settings button */}
          <button className="p-1 sm:p-2 bg-gray-700 rounded-lg hover:bg-gray-600 border border-gray-600">
            <Settings size={22} color="white" />
          </button>
        </div>

        {/* Text box */}
        <div className="p-4 sm:p-6 bg-gray-700 rounded-lg mb-4 sm:mb-6 border border-gray-500">
          {outputWord()}
          {/*<p className="text-base sm:text-lg leading-relaxed ">
            {displayedText}
          </p>*/}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          onChange={handleInputChange}
          type="text"
          placeholder="Start typing here..."
          className="w-full p-2 sm:p-5 rounded-lg bg-gray-700 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xl "
          disabled={isDisabled ? "disabled" : ""}
        />
      </div>

      <div className="flex items-center justify-center pt-4">
        {/* Reset button */}

        <button onClick={resetGame} className="px-6 py-3 text-xl hover:bg-gray-500 bg-gray-800 rounded-lg mb-6 border border-gray-600">
          Reset
        </button>
      </div>

      {/* Duplicate output removed; already rendered above with outputWord() */}
    </div>
  );
};

export default TypingSpace;