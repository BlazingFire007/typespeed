import { useEffect, useState, useRef } from 'react';
import paragraphs from './paragraphs';
function App() {
  const [text, setText] = useState<string[]>([]);
  const textArea = useRef<HTMLTextAreaElement>(null);
  const timeRef = useRef<HTMLHeadingElement>(null);
  const wordsRef = useRef<HTMLHeadingElement>(null);
  const wpmRef = useRef<HTMLHeadingElement>(null);
  const [time, setTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<boolean>(false);
  const [words, setWords] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  useEffect(() => {
    const timer = setInterval(() => {
      if (startTime) {
        setTime((prev) => prev + 0.1);
      }
    }, 100);
    if (!startTime) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [startTime]);
  useEffect(() => {
    if (time === 0 || words == 0) return;
    setWpm(Math.round((words / time) * 60));
  }, [time, words]);
  useEffect(() => {
    setText(() => {
      const newText = [];
      for (let i = 0; i < 3; i++) {
        newText.push(paragraphs[randInt(0, paragraphs.length - 1)]);
      }
      return newText;
    });
    textArea.current?.addEventListener('paste', (e) => {
      window.location.reload();
    });
    textArea.current?.addEventListener('input', (e) => {
      if (textArea.current === null) return;
      const text = textArea.current.value;
      findAndInsert(text);
      const textWords = text.split(' ');
      const para = document.querySelectorAll('p')[0];
      const paraWords = para.textContent?.split(' ');
      if (paraWords === undefined) return;
      if (text === '') {
        setStartTime(false);
      } else if (time === 0 && !startTime) {
        setStartTime(true);
      }
      let wordCount = words;
      for (let i = 0; i < textWords.length; i++) {
        if (paraWords[i] !== textWords[i]) break;
        setWords(++wordCount);
        if (wordCount === paraWords.length) {
          setText((prev) => {
            const newText = [...prev];
            newText.shift();
            newText.push(paragraphs[randInt(0, paragraphs.length - 1)]);
            return newText;
          });
          textArea.current.value = '';
          setTime(0);
          setStartTime(false);
        }
      }
      setWords(wordCount + words);
    });
    return () => {
      textArea.current?.removeEventListener('input', () => {});
    };
  }, []);
  return (
    <>
      <h1>How fast can you type?</h1>
      <header>
        <div className='sideby'>
          <h2 ref={timeRef}>Time: {time.toFixed(2)}</h2>
          <h2 ref={wordsRef}>Words: {words}</h2>
        </div>
        <div className='alone'>
          <h2 ref={wpmRef}>WPM: {wpm}</h2>
        </div>
      </header>
      <main>
        <textarea ref={textArea} />
        {text.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </main>
    </>
  );
}

export default App;

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function findAndInsert(text: string) {
  const removeRegex = /(?:<mark>)(.+?)(?:<\/mark>)/gm;
  const elements = document.querySelectorAll('p');
  elements.forEach((elem) => {
    elem.innerHTML = elem.innerHTML.replace(removeRegex, '$1');
    elem.innerHTML = elem.innerText.replaceAll(text, '<mark>' + text + '</mark>');
  });
}
