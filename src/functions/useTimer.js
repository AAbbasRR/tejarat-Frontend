import { useState, useEffect } from 'react'

const useTimer = (initialSeconds = 0, start = false) => {
    let initMinutes = Math.floor(initialSeconds / 60);
    let initSeconds = (initialSeconds % 60);

    const [minutes, setMinutes] = useState(initMinutes);
    const [seconds, setSeconds] = useState(initSeconds);
    const [finishTimer, setFinishTimer] = useState(false);

    let showSeconds = seconds.toString();
    let timerInterval;

    const timer = () => {
        setFinishTimer(false);
        timerInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(prevState => prevState - 1);
            } else {
                if (minutes > 0) {
                    setMinutes(prevState => prevState - 1);
                    setSeconds(59);
                } else {
                    clearInterval(timerInterval);
                    setFinishTimer(true);
                };
            };
        }, 1000);
    };

    useEffect(() => {
        if (start) timer();
        return () => clearInterval(timerInterval);
    }, [start, seconds]);

    useEffect(() => {
        if (finishTimer) {
            setMinutes(initMinutes);
            setSeconds(initSeconds);
        };
    }, [finishTimer]);

    if (showSeconds.length === 1) {
        showSeconds = `0${showSeconds}`;
    };

    return { minutes: minutes.toString(), seconds: showSeconds, finishTimer };
};

export default useTimer;
