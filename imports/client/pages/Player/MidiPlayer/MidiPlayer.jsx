import React from 'react';

import MidiPlayerContainer from './MidiPlayerContainer';

const Player = ({
    handlePlay,
    handleStop,
    parts,
    toggleMutePart,
    playButtonLabel,
}) => (
    <React.Fragment>
        <div>
            {/* these should be my button component, to handle touch also */}
            <button type="button" onClick={handlePlay}>
                {playButtonLabel}
            </button>
            <button type="button" onClick={handleStop}>
                Stop
            </button>
            <div id="progress-bar" />
        </div>

        <div>
            {parts.map(({ label, isMuted, handleToggleMutePart }, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={handleToggleMutePart}
                    style={{ fontWeight: isMuted ? 'normal' : 'bold' }}
                >
                    {label}
                </button>
            ))}
        </div>
    </React.Fragment>
);

export default MidiPlayerContainer(Player);
