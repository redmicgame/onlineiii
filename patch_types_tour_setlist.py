import re
with open('types.ts', 'r') as f:
    text = f.read()

text = text.replace(
    '| { type: "CANCEL_TOUR"; payload: { tourId: string } }',
    '| { type: "CANCEL_TOUR"; payload: { tourId: string } }\n  | { type: "EDIT_TOUR_SETLIST"; payload: { tourId: string; newSetlist: string[]; addedSongs: string[]; removedSongs: string[] } }'
)

with open('types.ts', 'w') as f:
    f.write(text)
