// An interface for playing a midi file (json format) with Tone.JS

// TODO: refactor to class

import ToneJS from 'tone';
import EventEmitter from 'events';

import { PLAYER_POLYPHONY } from './constants';

class PlayerEmitter extends EventEmitter {}
// used for custom events, that is, events not already handled ToneJS library
const playerEmitter = new PlayerEmitter();

const partVelocity = {};

const chordsOnByTime = {};
const noteBucket = {};

const createPart = (track, partIndex, { synth, Tone }) => {
    const part = new Tone.Part((time, note) => {
        // use the midi events / notes to play the synth
        synth.triggerAttackRelease(
            Tone.Frequency(note.name).transpose(0),
            note.duration,
            time,
            partVelocity[partIndex] || note.velocity,
        );

        noteBucket[note.time] = noteBucket[note.time] || 0;
        noteBucket[note.time] += 1;

        // Trigger a single event per chord, not for every note as it's not optimal
        // Emit chord event only when chord bucket filled with notes so that
        // we trigger it one time only and then we reset it to be able to trigger it again at replays
        if (noteBucket[note.time] === chordsOnByTime[note.time].length) {
            noteBucket[note.time] = 0;
            playerEmitter.emit('chordOn', chordsOnByTime[note.time]);
        }
    }, track.notes);

    part.start();

    return part;
};

const getNonEmptyTracks = tracks =>
    tracks.filter(({ notes }) => notes.length > 0);

const createPartsFromTracks = ({ tracks }, dependencies) =>
    getNonEmptyTracks(tracks).map((track, index) =>
        createPart(track, index, dependencies),
    );

const createChordOnAndOffGroups = ({ tracks }) => {
    getNonEmptyTracks(tracks).forEach(({ notes }, partIndex) => {
        notes.forEach(note => {
            chordsOnByTime[note.time] = [
                ...(chordsOnByTime[note.time] || []),
                { note, partIndex },
            ];
        });
    });
};

// Dependency Injection for easy testability
const makePlayer = (mid, Tone = ToneJS) => {
    const synth = new Tone.PolySynth(PLAYER_POLYPHONY).toMaster();

    const parts = createPartsFromTracks(mid, { synth, Tone });

    createChordOnAndOffGroups(mid);
    // console.log(chordsOnByTime, chordsOffByTime, 'mid', mid);
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
    };

    let getProgressEmmiterId;
    const startProgressEmission = () => {
        emitCurrentProgressEvent();
        getProgressEmmiterId = setInterval(emitCurrentProgressEvent, 1000);
    };
    const stopProgressEmission = () => {
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
        getParts: () => parts,
        getCurrentTime: () => Tone.Transport.seconds,
        toggleMutePart: part => {
            part.mute = !part.mute;
            return part.mute;
        },
        setProgress: seconds => {
            Tone.Transport.seconds = seconds;
        },
        setPartVelocity: (partIndex, velocity) => {
            partVelocity[partIndex] = velocity;
        },
        onPlay: callback => Tone.Transport.on('start', callback),
        onStop: callback => Tone.Transport.on('stop', callback),
        onProgress: callback => playerEmitter.on('progress', callback),
        onChordOn: callback => playerEmitter.on('chordOn', callback),
        onChordOff: callback => playerEmitter.on('chordOff', callback),
    };
};

export default makePlayer;
