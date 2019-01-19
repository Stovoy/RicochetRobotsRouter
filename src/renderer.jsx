import "../style.scss";

import React from "react";
import ReactDOM from "react-dom";

class Board extends React.Component {
    render() {
        const spaces = this.props.spaces;
        const height = spaces.length;
        const width = spaces[0].length;

        const board = [];
        for (let y = 0; y < height; y++) {
            const rowItems = [];
            for (let x = 0; x < width; x++) {
                const space = spaces[y][x];
                rowItems.push(<Space key={`${y},${x}`} space={space}/>);
            }
            board.push(<BoardRow key={y}>{rowItems}</BoardRow>);
        }

        return (
            <div className="board">
                {board}
            </div>
        );
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

module.exports = {
    render: (spaces) => {
        ReactDOM.render((
            <Board spaces={spaces}/>
        ), document.getElementById("app"));
    },
};
