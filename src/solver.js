/**
 *
 * @param spaces A grid of spaces as returned by app.parseBoard()
 * @param robots An array of objects like {x: 0, y: 0, color: "red"}
 * @param destinations An array of objects like [{x: 0, y: 0, "color": "red"}]
 */
function solve(spaces, robots, destinations) {
    // Seen will contain the set of all visited positions, based on the robots.
    // Each position is represented by a string like "0,1,2,3", where each robot"s
    // x and y values are concatenated into one string. The robot order is the same
    // as the robot order in the parameters.
    const seen = new Set();

    const position = {
        robots: robots,
        moveRobot: null,
        moveDirection: null,
        moveCount: 0,
        parent: null,
    };

    seen.add(getPositionKey(robots));

    const queue = [position];
    while (queue.length > 0) {
        const position = queue.shift();
        if (position.moveCount > 50) {
            return null;
        }
        const robots = position.robots;
        for (let robotIndex = 0; robotIndex < robots.length; robotIndex++) {
            const robot = robots[robotIndex];
            for (let destination of destinations) {
                if (destination.x === robot.x && destination.y === robot.y &&
                    (destination.color === robot.color || destination.color === "any")) {
                    // We found a solution! Must be the best answer since this is BFS.
                    return extractMoves(position);
                }
            }

            for (let direction of ["west", "north", "east", "south"]) {
                let newPosition = moveRobotInDirection(spaces, robots, robotIndex, direction);
                const positionKey = getPositionKey(newPosition.robots);
                if (!seen.has(positionKey)) {
                    newPosition.moveRobot = robotIndex;
                    newPosition.moveCount = position.moveCount + 1;
                    newPosition.parent = position;
                    seen.add(positionKey);
                    queue.push(newPosition);
                }
            }
        }
    }
}

function moveRobotInDirection(spaces, robots, robotIndex, direction) {
    const newRobots = robots.map(r => Object.assign({}, r));
    const robot = newRobots[robotIndex];

    let space = spaces[robot.y][robot.x];
    while (space.canGo(direction) && !robotInDirection(robot, direction, robots)) {
        switch (direction) {
            case "west":
                robot.x -= 1;
                break;
            case "north":
                robot.y -= 1;
                break;
            case "east":
                robot.x += 1;
                break;
            case "south":
                robot.y += 1;
                break;
        }
        space = spaces[robot.y][robot.x];
    }

    return {
        robots: newRobots,
        moveDirection: direction,
    }
}

function getPositionKey(robots) {
    let position = "";
    for (let robot of robots) {
        position += robot.x + "," + robot.y + ",";
    }
    return position;
}

function extractMoves(position) {
    const moves = [];
    while (position.parent !== null) {
        moves.unshift({
            direction: position.moveDirection,
            before: position.parent.robots[position.moveRobot],
            after: position.robots[position.moveRobot],
            robots: position.robots,
        });
        position = position.parent;
    }
    return moves;
}

function robotInDirection(robot, direction, robots) {
    let position;
    switch (direction) {
        case "west":
            position = {x: robot.x - 1, y: robot.y};
            break;
        case "north":
            position = {x: robot.x, y: robot.y - 1};
            break;
        case "east":
            position = {x: robot.x + 1, y: robot.y};
            break;
        case "south":
            position = {x: robot.x, y: robot.y + 1};
            break;
    }

    for (let robot of robots) {
        if (robot.x === position.x && robot.y === position.y) {
            return true;
        }
    }

    return false;
}

module.exports = {
    solve,
};
