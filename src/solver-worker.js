import {solve} from "./solver";
import {getSpaces} from "./parser";

const spaces = getSpaces();

onmessage = event => {
    const robots = event.data.robots;
    const destinations = event.data.destinations;
    postMessage(
        solve(spaces, robots, destinations,
            (move) => postMessage({move: move}))
    );
};
