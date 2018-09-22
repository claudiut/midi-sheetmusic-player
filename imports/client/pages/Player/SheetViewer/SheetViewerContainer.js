// import verovio from 'verovio-dev';
import {
    withProps,
    compose,
    renderNothing,
    lifecycle,
    branch,
} from 'recompose';

const verovio = require('/vendor/verovio.js');
const verovioToolkit = new verovio.toolkit();

const withSheetMusicProps = branch(
    ({ musicXmlData }) => !!musicXmlData,

    withProps(({ musicXmlData }) => {
        console.log('>>', musicXmlData);

        return {
            sheetMusicSvg: verovioToolkit.renderData(musicXmlData, {}),
        };
    }),

    renderNothing,
);

const loadSheetMusicFile = lifecycle({
    componentDidMount() {
        fetch('brand.mei').then(res => {
            res.blob().then(musicXmlData => {
                this.setState({ musicXmlData });
            });
        });
    },
});

export default compose(
    loadSheetMusicFile,
    withSheetMusicProps,
);
