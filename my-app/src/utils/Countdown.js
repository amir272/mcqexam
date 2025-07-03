import {useEffect, useState} from "react";

function Countdown({ minute }) {
    const [time, setTime] = useState({ minutes: minute, seconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(time => {
                if (time.seconds > 0) {
                    return { minutes: time.minutes, seconds: time.seconds - 1 };
                } else if (time.minutes > 0) {
                    return { minutes: time.minutes - 1, seconds: 59 };
                } else {
                    clearInterval(interval);
                    return time;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [minute]);

    return {time};
}

export default Countdown;
