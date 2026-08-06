import fs from 'fs';
let code = fs.readFileSync('components/CreateVideoView.tsx', 'utf8');

code = code.replace(
  "dispatch({ type: 'CHANGE_VIEW', payload: 'youtube' });",
  "dispatch({ type: 'CHANGE_VIEW', payload: 'game' });"
);

code = code.replace(
  "<button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'youtube'})} className=\"p-2 rounded-full hover:bg-white/10\">",
  "<button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className=\"p-2 rounded-full hover:bg-white/10\">"
);

fs.writeFileSync('components/CreateVideoView.tsx', code);
