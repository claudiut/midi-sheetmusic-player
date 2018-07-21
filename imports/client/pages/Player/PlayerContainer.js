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
    { player: undefined },
    {
        setPlayer: () => player => ({ player }),
    },
);

const withPlayerLifecycle = lifecycle({
    componentDidMount() {
        const fileUrl = getQueryString('file');

        if (fileUrl) {
            const { setPlayer } = this.props;

            MidiConvert.load(fileUrl).then(mid => {
                const player = makePlayer(mid);
                setPlayer(player);
            });
        }
    },
});

const withPlayerProps = withProps(
    ({ player: { play, stop, getParts, toggleMutePart } }) => ({
        handlePlay: play,
        handleStop: stop,
        parts: getParts(),
        toggleMutePart,
    }),
);

const renderWhenPlayerLoaded = branch(
    ({ player }) => !!player,
    withPlayerProps,
    renderNothing,
);

export default compose(
    withPlayerState,
    withPlayerLifecycle,
    renderWhenPlayerLoaded,
);
