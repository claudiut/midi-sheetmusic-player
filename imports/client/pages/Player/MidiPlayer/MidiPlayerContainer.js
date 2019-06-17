import MidiConvert from 'midiconvert';
import Tone from 'tone';
import Soundfont from 'soundfont-player';
import {
    compose,
    lifecycle,
    branch,
    renderNothing,
} from 'recompose';

import getQueryString from '/imports/client/utils/getQueryString';
import makePlayer from '/imports/client/lib/player/factory';

const loadFileIntoPlayer = lifecycle({
    componentDidMount() {
        const fileUrl = getQueryString('file');

        if (fileUrl) {
            Promise.all([
                MidiConvert.load(fileUrl),
                Soundfont.instrument(Tone.context, '/soundfonts/acoustic_grand_piano-mp3.js'),
            ]).then(([mid, instrument]) => {
                const player = makePlayer(mid);
                player.setInstrument(instrument);
                this.setState({ player });
            });
        }
    },
});

export default compose(
    loadFileIntoPlayer,
    branch(({ player }) => !player, renderNothing),
);
