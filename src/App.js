import React, { useState } from "react";
import Draggable from "react-draggable";
import "./App.css";

function App() {
  const [texts, setTexts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const fontStyles = ["Arial", "Courier New", "Georgia", "Times New Roman", "Verdana"];

  // Save the current state to history
  const saveToHistory = (newState) => {
    setHistory([...history, JSON.stringify(newState)]);
    setRedoStack([]); // Clear redo stack after new changes
  };

  // Add a new text box
  const addText = () => {
    const newText = {
      id: Date.now(),
      text: "New Text",
      fontSize: 16,
      bold: false,
      italic: false,
      underline: false,
      textAlign: "left",
      fontFamily: "Arial",
    };
    const updatedTexts = [...texts, newText];
    setTexts(updatedTexts);
    saveToHistory(updatedTexts);
  };

  // Handle text changes
  const handleTextChange = (id, newText) => {
    const updatedTexts = texts.map((t) =>
      t.id === id ? { ...t, text: newText } : t
    );
    setTexts(updatedTexts);
    saveToHistory(updatedTexts);
  };

  // Handle font size changes
  const handleFontSizeChange = (size) => {
    const updatedTexts = texts.map((t) =>
      t.id === selectedId ? { ...t, fontSize: parseInt(size) } : t
    );
    setTexts(updatedTexts);
    saveToHistory(updatedTexts);
  };

  // Toggle bold, italic, or underline
  const toggleStyle = (style) => {
    const updatedTexts = texts.map((t) =>
      t.id === selectedId ? { ...t, [style]: !t[style] } : t
    );
    setTexts(updatedTexts);
    saveToHistory(updatedTexts);
  };

  // Change text alignment
  const handleTextAlign = (alignment) => {
    const updatedTexts = texts.map((t) =>
      t.id === selectedId ? { ...t, textAlign: alignment } : t
    );
    setTexts(updatedTexts);
    saveToHistory(updatedTexts);
  };

  // Change font family
  const handleFontChange = (font) => {
    const updatedTexts = texts.map((t) =>
      t.id === selectedId ? { ...t, fontFamily: font } : t
    );
    setTexts(updatedTexts);
    saveToHistory(updatedTexts);
  };

  // Undo last change
  const undo = () => {
    if (history.length > 0) {
      const previousState = JSON.parse(history.pop());
      setRedoStack([JSON.stringify(texts), ...redoStack]); // Save current state to redo stack
      setTexts(previousState); // Restore the previous state
      setHistory([...history]); // Update the history
    }
  };

  // Redo last undone change
  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = JSON.parse(redoStack.shift());
      setHistory([...history, JSON.stringify(texts)]); // Save current state to history
      setTexts(nextState); // Restore the next state
      setRedoStack([...redoStack]); // Update the redo stack
    }
  };

  return (
    <div className="text-editor">
      {/* Undo and Redo Toolbar */}
      <div className="toolbar-top">
          <button className="undo_redo" onClick={undo} disabled={history.length === 0}>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-arrow-counterclockwise mb-1" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
          </svg><br></br>
          Undo
        </button>
        <button className="undo_redo" onClick={redo} disabled={redoStack.length === 0}>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-arrow-clockwise mb-1" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
          </svg><br></br>
          Redo
        </button>
      </div>

      {/* Canvas for Draggable Text */}
      <div className="canvas">
        {texts.map((text) => (
          <Draggable key={text.id}>
            <div
              className={`text-box ${selectedId === text.id ? "selected" : ""}`}
              onClick={() => setSelectedId(text.id)}
              style={{
                fontSize: `${text.fontSize}px`,
                fontWeight: text.bold ? "bold" : "normal",
                fontStyle: text.italic ? "italic" : "normal",
                textDecoration: text.underline ? "underline" : "none",
                textAlign: text.textAlign,
                fontFamily: text.fontFamily,
              }}
            >
              <input
                type="text"
                value={text.text}
                onChange={(e) => handleTextChange(text.id, e.target.value)}
                style={{
                  fontSize: `${text.fontSize}px`,
                  fontWeight: text.bold ? "bold" : "normal",
                  fontStyle: text.italic ? "italic" : "normal",
                  textDecoration: text.underline ? "underline" : "none",
                  textAlign: text.textAlign,
                  fontFamily: text.fontFamily,
                  border: "none",
                  background: "transparent",
                  outline: "none",
                }}
               
              />
            </div>
          </Draggable>
        ))}
      </div>

      {/* Styling Options */}
      <div className="toolbar">
        {/* Font Dropdown */}
        <select
          onChange={(e) => handleFontChange(e.target.value)}
          disabled={!selectedId}
          className="round"
        >
          <option value="" disabled selected>
            Font
          </option>
          {fontStyles.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => handleFontSizeChange(e.target.value)}
          disabled={!selectedId}
          className="round"
        >
          <option value="16">16px</option>
          <option value="18">18px</option>
          <option value="20">20px</option>
          <option value="24">24px</option>
          <option value="28">28px</option>
          <option value="35">35px</option>
          <option value="40">40px</option>
          <option value="48">48px</option>
          <option value="54">54px</option>
          <option value="60">60px</option>
          <option value="70">70px</option>
          <option value="99">99px</option>
        </select>
        {/* Bold, Italic, Underline */}
        <button className="btnn" onClick={() => toggleStyle("bold")} disabled={!selectedId}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-type-bold" viewBox="0 0 16 16">
            <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
          </svg>
        </button>
        <button className="btnn" onClick={() => toggleStyle("italic")} disabled={!selectedId}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-type-italic" viewBox="0 0 16 16">
            <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
          </svg>
        </button>
        <button className="btnn" onClick={() => handleTextAlign("center")} disabled={!selectedId}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-text-center" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
        </svg>
        </button>
        <button className="btnn" onClick={() => toggleStyle("underline")} disabled={!selectedId}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-type-underline" viewBox="0 0 16 16">
            <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57s-2.687-1.08-2.687-2.57zM12.5 15h-9v-1h9z"/>
          </svg>
        </button>        
       
      </div>
      <hr style={{color:"grey"}}></hr>
      {/* Add Text Button */}
      <button className="add-text-btn" onClick={addText}>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-fonts" viewBox="0 0 16 16">
          <path d="M12.258 3h-8.51l-.083 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.431.013c1.934.062 2.434.301 2.693 1.846h.479z"/>
        </svg>
        Add Text
      </button>
    </div>
  );
}

export default App;
