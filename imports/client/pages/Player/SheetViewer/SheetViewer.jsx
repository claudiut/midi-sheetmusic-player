import React from 'react';
import PropTypes from 'prop-types';

import SheetViewerContainer from './SheetViewerContainer';

const SheetViewer = ({ sheetMusicSvg }) => (
    <React.Fragment>{sheetMusicSvg}</React.Fragment>
);

SheetViewer.propTypes = {
    // sheetMusicSvg: PropTypes.node.isRequired,
};

export default SheetViewerContainer(SheetViewer);
