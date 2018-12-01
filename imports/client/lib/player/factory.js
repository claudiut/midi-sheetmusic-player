// An interface for playing a midi file (json format) with Tone.JS

import ToneJS from 'tone';
import EventEmitter from 'events';

import { PLAYER_POLYPHONY } from './constants';

class PlayerEmitter extends EventEmitter {}
// used for custom events, that is, events not already handled ToneJS library
const playerEmitter = new PlayerEmitter();

const createPart = (track, { synth, Tone }) => {
    const part = new Tone.Part((time, note) => {
        // use the midi events / notes to play the synth
        synth.triggerAttackRelease(
            Tone.Frequency(note.name).transpose(0),
            note.duration,
            time,
            note.velocity,
        );
    }, track.notes);

    part.start();

    return part;
};

const createPartsFromTracks = ({ tracks }, dependencies) =>
    tracks.map(track => createPart(track, dependencies));

const getNonEmptyParts = parts => parts.filter(({ length }) => length);

// Dependency Injection for easy testability
const makePlayer = (mid, Tone = ToneJS) => {
    const synth = new Tone.PolySynth(PLAYER_POLYPHONY).toMaster();

    const parts = createPartsFromTracks(mid, { synth, Tone });

    const stop = () => {
        Tone.context.resume().then(() => {
            Tone.Transport.stop();
        });
    };

    // progress emission handling
    const emitCurrentProgressEvent = () => {
        const songFinished = Tone.Transport.seconds > mid.duration;

        playerEmitter.emit('progress', {
            seconds: songFinished ? mid.duration : Tone.Transport.seconds,
            duration: mid.duration,
            measureNumber: parseInt(Tone.Transport.position.split(':')[0]),
        });

        if (songFinished) {
            stop();
        }

        console.log(Tone.Transport.state, Tone.Transport.seconds, mid.duration);
    };

    let getProgressEmmiterId;
    const startProgressEmission = () => {
        emitCurrentProgressEvent();
        getProgressEmmiterId = setInterval(emitCurrentProgressEvent, 1000);
    };
    const stopProgressEmission = () => {
        console.log('stopProgressEmission');
        clearInterval(getProgressEmmiterId);
    };

    Tone.Transport.on('start', startProgressEmission);
    Tone.Transport.on('stop, pause', stopProgressEmission);
    // end progress emission handling

    return {
        mid,
        play: () => {
            Tone.context.resume().then(() => {
                Tone.Transport.start('+0', Tone.Transport.position);
            });
        },
        pause: () => {
            Tone.context.resume().then(() => {
                Tone.Transport.pause();
            });
        },
        stop,
        isPlaying: () => Tone.Transport.state === 'started',
        getParts: getNonEmptyParts.bind(getNonEmptyParts, parts),
        toggleMutePart: part => {
            part.mute = !part.mute;
            return part.mute;
        },
        setProgress: seconds => {
            Tone.Transport.seconds = seconds;
        },
        onPlay: callback => Tone.Transport.on('start', callback),
        onStop: callback => Tone.Transport.on('stop', callback),
        onProgress: callback => playerEmitter.on('progress', callback),
    };
};

export default makePlayer;
