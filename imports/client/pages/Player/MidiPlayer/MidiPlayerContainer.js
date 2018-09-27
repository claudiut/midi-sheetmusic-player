import MidiConvert from 'midiconvert';
import {
    withProps,
    compose,
    withStateHandlers,
    lifecycle,
    branch,
    renderNothing,
} from 'recompose';

import getQueryString from '/imports/client/utils/getQueryString';
import makePlayer from '/imports/client/lib/player/factory';

const withPlayerState = withStateHandlers(
    { player: undefined, playButtonLabel: 'Play', mutedParts: {} },
    {
        setPlayer: () => player => ({ player }),
        setPlayButtonLabel: () => isPlaying => ({
            playButtonLabel: isPlaying ? 'Pause' : 'Play',
        }),
        setMutedPartState: ({ mutedParts }) => (partIndex, isMuted) => {
            return {
                mutedParts: {
                    ...mutedParts,
                    [partIndex]: isMuted,
                },
            };
        },
    },
);

const loadFileIntoPlayer = lifecycle({
    componentDidMount() {
        const fileUrl = getQueryString('file');

        if (fileUrl) {
            const { setPlayer } = this.props;

            MidiConvert.load(fileUrl).then(mid => {
                console.log('midi file loaded');
                const player = makePlayer(mid);
                setPlayer(player);
            });
        }
    },
});

const withPlayerProps = withProps(
    ({
        player: { play, pause, stop, getParts, toggleMutePart, isPlaying },
        setPlayButtonLabel,
        setMutedPartState,
        mutedParts,
    }) => ({
        handlePlay: () => {
            if (isPlaying()) {
                pause();
            } else {
                play();
            }

            setPlayButtonLabel(isPlaying());
        },

        handleStop: () => {
            stop();
            setPlayButtonLabel(isPlaying());
        },

        parts: getParts().map((part, index) => ({
            label: index + 1,
            isMuted: mutedParts[index],
            handleToggleMutePart: () => {
                toggleMutePart(part);
                console.log('>>', index, part.mute);
                setMutedPartState(index, part.mute);
            },
        })),
    }),
);

const renderWhenPlayerLoaded = branch(
    ({ player }) => !!player,
    withPlayerProps,
    renderNothing,
);

export default compose(
    withPlayerState,
    loadFileIntoPlayer,
    renderWhenPlayerLoaded,
);
