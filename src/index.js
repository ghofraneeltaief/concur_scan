import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
var n = "%c\n" +
" _    _   _____  ____    _____   ____ \n" + 
"| |  | | |_   _| |  _ \\ |_   _| / __ \\ \n" + 
"| |__| |   | |   | |_) |  | |  | |  | |   \n" + 
"|  __  |   | |   |  __/   | |  | |  | | \n" + 
"| |  | |  _| |_  | |      | |  | |__| | \n" + 
"|_|  |_| |_____| |_|      | |   \\____/ \n" + 
"      Rejoignez-nous ! #hipto            \n";

console.log(n, "color:blue; font-weight:bold; font-family:monospace;");
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Suspense>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Suspense>
);
