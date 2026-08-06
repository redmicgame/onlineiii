import React from 'react';

const SpotifyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" alt="Spotify" className={className} />
);

export default SpotifyIcon;