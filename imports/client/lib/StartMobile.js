import Tone from 'tone';
import StartAudioContext from '/imports/vendor/StartAudioContext';

export default () => {
    // send the ready message to the parent
    const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    const isAndroid = /Android/.test(navigator.userAgent) && !window.MSStream;

    // full screen button on iOS
    if (isIOS || isAndroid) {
        // make a full screen element and put it in front
        const iOSTapper = document.createElement('div');
        iOSTapper.id = 'iOSTap';
        document.body.appendChild(iOSTapper);
        // alert('CONTEXT' + Tone.context.toString());
        new StartAudioContext(Tone.context, iOSTapper).then(() => {
            iOSTapper.remove();
            // window.parent.postMessage('ready', '*');
        });
    } else {
        // window.parent.postMessage('ready', '*');
    }
};
