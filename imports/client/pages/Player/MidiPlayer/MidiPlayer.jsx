import React from 'react';
import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';

import MidiPlayerContainer from './MidiPlayerContainer';
import {
    LABELS,
    VELOCITIES,
    KEY_CODES,
    PROGRESS_JUMP_IN_SECONDS,
} from '/imports/client/pages/Player/MidiPlayer/constants';
import { findAncestor } from '/imports/client/lib/helpers';
import getQueryString from '/imports/client/utils/getQueryString';

class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mutedParts: {},
            partVelocity: {},
            partCurrentNotes: {},
            percentage: 0,
            playButtonLabel: LABELS.PLAY,
        };
    }

    partCurrentNotesTimeout = {};

    componentDidMount() {
        const { player } = this.props;

        player.onStop(() =>
            this.setState({ percentage: 0, playButtonLabel: LABELS.PLAY }),
        );

        player.onProgress(({ seconds, duration }) => {
            this.setState(() => ({
                percentage: (seconds / duration) * 100,
                playButtonLabel: LABELS.PAUSE,
            }));
        });

        player.onNote(note => {
            clearTimeout(this.partCurrentNotesTimeout[note.partIndex]);

            this.setCurrentNote(note);

            this.partCurrentNotesTimeout[note.partIndex] = setTimeout(() => {
                const partCrtNotes = cloneDeep(this.state.partCurrentNotes);
                delete partCrtNotes[note.partIndex];
                this.setState(() => ({
                    partCurrentNotes: partCrtNotes,
                }));
            }, note.note.duration * 1000 - 50);
        });

        player.getParts().forEach((part, index) => {
            this.setPartVelocity(index, VELOCITIES.LOWEST);
        });

        window.addEventListener('keydown', this.handleKeyPress);

        window.player = this.props.player;
    }

    setCurrentNote = ({ partIndex, note: { velocity, duration, time } }) => {
        this.setState(({ partCurrentNotes = {} }) => ({
            partCurrentNotes: {
                ...partCurrentNotes,
                [partIndex]: {
                    velocity,
                    duration,
                    time,
                },
            },
        }));
    };

    setProgress = percentage => {
        const { player } = this.props;

        player.setProgress(percentage * player.mid.duration);

        // this is to show the progress bar even when song is stoppped
        this.setState(() => ({ percentage: percentage * 100 }));
    };

    setPartVelocity = (index, value) => {
        const velocity = parseFloat(value);
        this.props.player.setPartVelocity(index, velocity);

        this.setState(({ partVelocity = {} }) => ({
            partVelocity: {
                ...partVelocity,
                [index]: velocity,
            },
        }));
    };

    getPartCurrentVelocity = index => {
        return (this.state.partCurrentNotes[index] || {}).velocity || 0;
    };

    getPartCurrentDuration = index => {
        return (this.state.partCurrentNotes[index] || {}).duration || 0;
    };

    setProgressJump = jumpValue => {
        const {
            player: { getCurrentTime, mid },
        } = this.props;

        const seekSeconds = getCurrentTime() + jumpValue;
        const newSeconds = Math.min(mid.duration, Math.max(0, seekSeconds));
        const newProgress = newSeconds / mid.duration;

        this.setProgress(newProgress);
    };

    handleKeyPress = ({ key, keyCode }) => {
        if (key === ' ' || keyCode === KEY_CODES.SPACE) {
            this.handlePlay();
        } else if (keyCode === KEY_CODES.ARROW_LEFT) {
            this.setProgressJump(-1 * PROGRESS_JUMP_IN_SECONDS);
        } else if (keyCode === KEY_CODES.ARROW_RIGHT) {
            this.setProgressJump(PROGRESS_JUMP_IN_SECONDS);
        }
    };

    handlePlay = () => {
        const { player } = this.props;
        if (player.isPlaying()) {
            player.pause();
            this.setState({ playButtonLabel: LABELS.PLAY });
        } else {
            player.play();
            this.setState({ playButtonLabel: LABELS.PAUSE });
        }
    };

    handleStop = () => {
        this.props.player.stop();
    };

    handleProgressChange = ({ target, clientX }) => {
        const progressBarWrapper = findAncestor(target, 'progress-bar-wrapper');

        const { left, right } = progressBarWrapper.getBoundingClientRect();

        const percentageClicked =
            Math.max(clientX - left, 0) / Math.max(right - left, 0);

        this.setProgress(percentageClicked);
    };

    handlePartVolumeChange = ({ target, clientY }, index) => {
        const volumeBarWrapper = findAncestor(target, 'part-volume-wrapper');

        const { top, bottom } = volumeBarWrapper.getBoundingClientRect();

        const velocity = Math.max(clientY - top, 0) / Math.max(bottom - top, 0);

        this.setPartVelocity(index, velocity);
    };

    render() {
        const { player } = this.props;
        const songTitle = getQueryString('title');
        console.log(this.state.partCurrentNotes);

        return (
            <div id="midi-player-wrapper">
                {songTitle && <div id="song-title">{songTitle}</div>}
                <div id="midi-player">
                    <div className="main-part">
                        <button type="button" onClick={this.handlePlay}>
                            {this.state.playButtonLabel}
                        </button>

                        <button type="button" onClick={this.handleStop}>
                            {LABELS.STOP}
                        </button>

                        <div
                            className="progress-bar-wrapper"
                            onClick={this.handleProgressChange}
                        >
                            <div
                                className="progress-bar"
                                style={{ width: `${this.state.percentage}%` }}
                            />
                        </div>
                    </div>
                    <div className="mixer-part">
                        {player.getParts().map((part, index) => (
                            <div className="voice-container" key={index}>
                                <button
                                    type="button"
                                    className={classNames({
                                        'voice-button': true,
                                        muted: !!this.state.mutedParts[index],
                                    })}
                                    onClick={() => {
                                        player.toggleMutePart(part);
                                        this.setState({
                                            mutedParts: {
                                                ...this.state.mutedParts,
                                                [index]: part.mute,
                                            },
                                        });
                                    }}
                                >
                                    {index + 1}
                                </button>

                                <div
                                    className="part-volume-wrapper"
                                    onClick={event => {
                                        this.handlePartVolumeChange(
                                            event,
                                            index,
                                        );
                                    }}
                                >
                                    <span className="volume-label-min">
                                        MIN
                                    </span>
                                    <span className="volume-label-max">
                                        MAX
                                    </span>
                                    <div
                                        className="part-volume"
                                        style={{
                                            height: `${this.state.partVelocity[
                                                index
                                            ] * 100}%`,
                                        }}
                                    >
                                        <div
                                            className={classNames(
                                                'volume-meter',
                                                {
                                                    animate: !!this.state
                                                        .partCurrentNotes[
                                                        index
                                                    ],
                                                },
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default MidiPlayerContainer(Player);
