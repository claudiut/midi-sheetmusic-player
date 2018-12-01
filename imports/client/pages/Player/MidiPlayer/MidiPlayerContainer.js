import MidiConvert from 'midiconvert';
import {
    compose,
    lifecycle,
    branch,
    renderNothing,
    renderComponent,
} from 'recompose';

import getQueryString from '/imports/client/utils/getQueryString';
import makePlayer from '/imports/client/lib/player/factory';

const loadFileIntoPlayer = lifecycle({
    componentDidMount() {
        const fileUrl = getQueryString('file');

        if (fileUrl) {
            MidiConvert.load(fileUrl).then(mid => {
                const player = makePlayer(mid);
                this.setState({ player });
            });
        }
    },
});

const renderWhenLoaded = hoc =>
    branch(({ player }) => !!player, hoc, renderNothing);

export default compose(
    loadFileIntoPlayer,
    branch(({ player }) => !player, renderNothing),
);
