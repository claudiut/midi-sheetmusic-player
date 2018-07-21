// An interface for playing a midi file (json format) with Tone.JS

import ToneJS from 'tone';

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

// Dependency Injection for easy testability
const makePlayer = (mid, Tone = ToneJS) => {
    const synth = new Tone.PolySynth(10).toMaster();

    const parts = createPartsFromTracks(mid, { synth, Tone });

    return {
        play: () => {
            if (Tone.Transport.state === 'started') {
                return Tone.Transport.pause();
            }

            Tone.Transport.start('+0', Tone.Transport.position);
        },

        stop: () => {
            Tone.Transport.stop();
        },

        // what is the first track and why is always kind of empty?
        getParts: () => parts,

        toggleMutePart: part => {
            part.mute = !part.mute;
            return part.mute;
        },
    };
};

export default makePlayer;
