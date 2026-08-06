import fs from 'fs';
let code = fs.readFileSync('App.tsx', 'utf8');

code = code.replace(
  "import MTVView from './components/MTVView';",
  "import MTVView from './components/MTVView';\nimport CreateMagazineInterviewView from './components/CreateMagazineInterviewView';\nimport CreateTvInterviewView from './components/CreateTvInterviewView';"
);

code = code.replace(
  "{currentView === 'mtv' && <MTVView />}",
  "{currentView === 'mtv' && <MTVView />}\n      {currentView === 'createMagazineInterview' && <CreateMagazineInterviewView />}\n      {currentView === 'createTvInterview' && <CreateTvInterviewView />}"
);

fs.writeFileSync('App.tsx', code);
