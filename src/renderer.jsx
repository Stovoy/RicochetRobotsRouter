import "../style.scss";
import React from "react";
import ReactDOM from "react-dom";
import {solve} from "./solver";

class Board extends React.Component {
    constructor() {
        super();

        this.state = {
            solutionStep: null,
        };
    }

    render() {
        const spaces = this.props.spaces;
        const height = spaces.length;
        const width = spaces[0].length;

        const board = [];
        for (let y = 0; y < height; y++) {
            const rowItems = [];
            for (let x = 0; x < width; x++) {
                const space = spaces[y][x];

                let robotOnSpace = null;

                const step = this.state.solutionStep;
                if (step !== null) {
                    if (step.before.x === x &&
                        step.before.y === y) {

                        robotOnSpace = <Robot before
                                              key={`robot-${y},${x}`}
                                              color={step.before.color}/>;
                    }
                    for (let robot of step.robots) {
                        if (robot.x === x && robot.y === y) {
                            robotOnSpace = <Robot key={`robot-${y},${x}`}
                                                  color={robot.color}/>;
                            break;
                        }
                    }
                }

                rowItems.push(<Space key={`${y},${x}`} space={space} robot={robotOnSpace}/>);
            }
            board.push(<BoardRow key={y}>{rowItems}</BoardRow>);
        }

        return (
            <div className="board">
                {board}
                <Solver spaces={this.props.spaces}
                        setSolutionStep={(solutionStep) => this.setSolutionStep(solutionStep)}/>
            </div>
        );
    }

    setSolutionStep(solutionStep) {
        this.setState({
            solutionStep: solutionStep
        });
    }
}

class BoardRow extends React.Component {
    render() {
        return (
            <div className="board-row">
                {this.props.children}
            </div>
        )
    }
}

class Space extends React.Component {
    render() {
        const space = this.props.space;
        return (
            <div className="space">
                {space.solid ? <Wall type="solid"/> : null}
                {space.westWall ? <Wall type="west"/> : null}
                {space.northWall ? <Wall type="north"/> : null}
                {space.eastWall ? <Wall type="east"/> : null}
                {space.southWall ? <Wall type="south"/> : null}
                {this.northWestCorner() ? <Corner type="north-west"/> : null}
                {this.northEastCorner() ? <Corner type="north-east"/> : null}
                {this.southEastCorner() ? <Corner type="south-east"/> : null}
                {this.southWestCorner() ? <Corner type="south-west"/> : null}
                {this.props.robot}
                {space.shape ? <Shape shape={space.shape} color={space.color}/> : null}
            </div>
        );
    }

    northWestCorner() {
        const space = this.props.space;
        return space.north && space.north.westWall || space.west && space.west.northWall;
    }

    northEastCorner() {
        const space = this.props.space;
        return space.north && space.north.eastWall || space.east && space.east.northWall;
    }

    southEastCorner() {
        const space = this.props.space;
        return space.south && space.south.eastWall || space.east && space.east.southWall;
    }

    southWestCorner() {
        const space = this.props.space;
        return space.south && space.south.westWall || space.west && space.west.southWall;
    }
}

class Wall extends React.Component {
    render() {
        return <div className={`wall-${this.props.type}`}/>;
    }
}

class Shape extends React.Component {
    render() {
        return <div className={`${this.getShapeClass()} ${this.getColorClass()}`}/>
    }

    getShapeClass() {
        if (this.props.shape === "/") {
            return "shape-slash";
        }

        if (this.props.shape === "\\") {
            return "shape-backslash";
        }

        return `shape-${this.props.shape}`;
    }

    getColorClass() {
        return `color-${this.props.color}`;
    }
}

class Corner extends React.Component {
    render() {
        return <div className={`corner-${this.props.type}`}/>;
    }
}

class Robot extends React.Component {
    render() {
        return <div className={`${this.props.before ? 'robot-before' : 'robot'} color-${this.props.color}`}/>
    }
}

class Solver extends React.Component {
    constructor() {
        super();
        this.state = {
            solution: null,
            selectedIndex: 0,
        };
    }

    componentWillMount() {
        this.onSolveClick();
    }

    render() {
        const solutionSteps = [];
        if (this.state.solution !== null) {
            for (let i = 0; i < this.state.solution.length; i++) {
                const solutionStep = this.state.solution[i];
                solutionSteps.push(
                    <SolutionStep
                        key={i}
                        step={solutionStep}
                        selected={i === this.state.selectedIndex}
                        onSelection={() => this.onSelection(i)}
                    />
                );
            }
        }

        return (
            <div className='solver'>
                {solutionSteps}
                <input type='button' value='Solve' className='solve-button'
                       onClick={() => this.onSolveClick()}>
                </input>
            </div>
        );
    }

    onSelection(i) {
        this.setState({
            selectedIndex: i,
        });
        this.props.setSolutionStep(this.state.solution[i]);
    }

    onSolveClick() {
        const solution = solve(this.props.spaces,
            [{x: 13, y: 8, color: "green"}, {x: 12, y: 5, color: "red"}],
            [{x: 9, y: 2, color: "green"}]);
        this.setState({
            solution: solution,
            selectedIndex: 0,
        });
        this.props.setSolutionStep(solution[0]);
    }
}

class SolutionStep extends React.Component {
    render() {
        return (
            <div className={`solution-step` + (this.props.selected ? ' selected' : '')}
                 onClick={() => this.props.onSelection()}>
                {this.props.step.direction}
            </div>
        );
    }
}

module.exports = {
    render: (spaces) => {
        ReactDOM.render((
            <Board spaces={spaces}/>
        ), document.getElementById("app"));
    },
};
