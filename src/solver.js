/**
 *
 * @param spaces A grid of spaces as returned by app.parseBoard()
 * @param robots An array of objects like {x: 0, y: 0, color: "red"}
 * @param destinations An array of objects like [{x: 0, y: 0, "color": "red"}]
 * @param onMove A function to call as progress is made.
 */
function solve(spaces, robots, destinations, onMove = null) {
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
    let lastSentMove = 0;
    const occupiedPositions = new Array(spaces.length * spaces[0].length);
    while (queue.length > 0) {
        const position = queue.shift();
        if (position.moveCount > 25) {
            return null;
        }

        if (onMove !== null && position.moveCount > lastSentMove) {
            onMove(position.moveCount);
            lastSentMove = position.moveCount;
        }

        const robots = position.robots;
        for (let robot of robots) {
            occupiedPositions[robot.y * spaces.length + robot.x] = true;
        }

        for (let robotIndex = 0; robotIndex < robots.length; robotIndex++) {
            const robot = robots[robotIndex];
            for (let destination of destinations) {
                if (destination.x === robot.x && destination.y === robot.y &&
                    (destination.color === robot.color || destination.color === "any")) {
                    // We found a solution! Must be the best answer since this is BFS.
                    return extractMoves(position);
                }
            }

            for (let direction of [0, 1, 2, 3]) {
                let newPosition = moveRobotInDirection(spaces, robots, robotIndex, direction, occupiedPositions);
                if (newPosition !== null) {
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
        for (let robot of robots) {
            occupiedPositions[robot.y * spaces.length + robot.x] = false;
        }
    }

    return null;
}

function moveRobotInDirection(spaces, robots, robotIndex, direction, occupiedPositions) {
    const newRobots = robots.map(r => Object.assign({}, r));
    const robot = newRobots[robotIndex];

    let space = spaces[robot.y][robot.x];
    let moved = false;

    // Critical code path... extracted branches out of loop.
    switch (direction) {
        case 0:
            while (!space.westWall && space.west && !occupiedPositions[robot.y * spaces.length + robot.x - 1]) {
                robot.x -= 1;
                space = spaces[robot.y][robot.x];
                moved = true;
            }
            break;
        case 1:
            while (!space.northWall && space.north && !occupiedPositions[(robot.y - 1) * spaces.length + robot.x]) {
                robot.y -= 1;
                space = spaces[robot.y][robot.x];
                moved = true;
            }
            break;
        case 2:
            while (!space.eastWall && space.east && !occupiedPositions[robot.y * spaces.length + robot.x + 1]) {
                robot.x += 1;
                space = spaces[robot.y][robot.x];
                moved = true;
            }
            break;
        case 3:
            while (!space.southWall && space.south && !occupiedPositions[(robot.y + 1) * spaces.length + robot.x]) {
                robot.y += 1;
                space = spaces[robot.y][robot.x];
                moved = true;
            }
            break;
    }

    if (!moved) {
        return null;
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
        case 0:
            position = {x: robot.x - 1, y: robot.y};
            break;
        case 1:
            position = {x: robot.x, y: robot.y - 1};
            break;
        case 2:
            position = {x: robot.x + 1, y: robot.y};
            break;
        case 3:
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
