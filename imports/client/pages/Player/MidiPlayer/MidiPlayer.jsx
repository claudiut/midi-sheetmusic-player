import React from 'react';
import Tone from 'tone';

import PlayerContainer from './PlayerContainer';

const Player = ({ handlePlay, handleStop, parts, toggleMutePart }) => (
    <React.Fragment>
        <div>
            {/* these should be my button component, to handle touch also */}
            <button type="button" onClick={handlePlay}>
                Play
            </button>
            <button type="button" onClick={handleStop}>
                Stop
            </button>
            <div id="progress-bar" />
        </div>

        <div>
            {parts.map((part, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => toggleMutePart(part)}
                >
                    {index + 1}
                </button>
            ))}
        </div>
    </React.Fragment>
);

export default PlayerContainer(Player);
