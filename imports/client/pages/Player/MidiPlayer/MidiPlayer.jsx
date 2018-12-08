import React from 'react';

import MidiPlayerContainer from './MidiPlayerContainer';
import {
    LABELS,
    VELOCITIES,
} from '/imports/client/pages/Player/MidiPlayer/constants';
import { findAncestor } from '/imports/client/lib/helpers';

class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mutedParts: {},
            partVelocity: {},
            percentage: 0,
            playButtonLabel: LABELS.PLAY,
        };
    }

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

        player.getParts().forEach((part, index) => {
            this.setPartVelocity(index, VELOCITIES.LOWEST);
        });

        window.player = this.props.player;
    }

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

        const {
            player: {
                mid: { duration },
                setProgress,
            },
        } = this.props;
        const { left, right } = progressBarWrapper.getBoundingClientRect();

        const percentageClicked =
            Math.max(clientX - left, 0) / Math.max(right - left, 0);

        setProgress(percentageClicked * duration);

        // this is to show the progress bar even when song is stoppped
        this.setState(() => ({ percentage: percentageClicked * 100 }));
    };

    setPartVelocity = (index, value) => {
        this.props.player.setPartVelocity(index, parseFloat(value));

        this.setState({
            ...(this.state.partVelocity || {}),
            [index]: value,
        });
    };

    render() {
        const { player } = this.props;

        return <React.Fragment>
                <table id="midi-player" style={{ width: '100%' }}>
                    <tbody>
                        <tr>
                            <td>
                                <button type="button" onClick={this.handlePlay}>
                                    {this.state.playButtonLabel}
                                </button>
                            </td>
                            <td>
                                <button type="button" onClick={this.handleStop}>
                                    {LABELS.STOP}
                                </button>
                            </td>

                            <td className="progress-bar-wrapper" onClick={this.handleProgressChange}>
                                <div className="progress-bar" style={{ width: `${this.state.percentage}%` }}>
                                    {/*                                    <div className="progress-bar-overlay">
                                        {measureNumber
                                            ? `masura ${measureNumber}`
                                            : ''}
                                        </div>*/}
                                </div>
                            </td>

                            <td className="part-buttons">
                                {player
                                    .getParts()
                                    .map((part, index) => (
                                        <div key={index}>
                                            <button
                                                type="button"
                                                className={`voice-button-${index}`}
                                                onClick={() => {
                                                    player.toggleMutePart(
                                                        part,
                                                    );
                                                    this.setState({
                                                        mutedParts: {
                                                            ...this
                                                                .state
                                                                .mutedParts,
                                                            [index]:
                                                                part.mute,
                                                        },
                                                    });
                                                }}
                                                style={{
                                                    fontWeight: this
                                                        .state
                                                        .mutedParts[
                                                        index
                                                    ]
                                                        ? 'normal'
                                                        : 'bold',
                                                }}
                                            >
                                                {index + 1}
                                            </button>
                                            <br />
                                            <select
                                                value={
                                                    this.state
                                                        .partVelocity[
                                                        index
                                                    ]
                                                }
                                                onChange={({
                                                    target: { value },
                                                }) => {
                                                    this.setPartVelocity(
                                                        index,
                                                        parseFloat(
                                                            value,
                                                        ),
                                                    );
                                                }}
                                            >
                                                <option
                                                    value={
                                                        VELOCITIES.LOWEST
                                                    }
                                                >
                                                    Lowest
                                                </option>
                                                <option
                                                    value={
                                                        VELOCITIES.LOW
                                                    }
                                                >
                                                    Low
                                                </option>
                                                <option
                                                    value={
                                                        VELOCITIES.MEDIUM
                                                    }
                                                >
                                                    Medium
                                                </option>
                                                <option
                                                    value={
                                                        VELOCITIES.HIGH
                                                    }
                                                >
                                                    High
                                                </option>
                                                <option
                                                    value={
                                                        VELOCITIES.HIGHEST
                                                    }
                                                >
                                                    Highest
                                                </option>
                                            </select>
                                        </div>
                                    ))}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>;
    }
}

export default MidiPlayerContainer(Player);
