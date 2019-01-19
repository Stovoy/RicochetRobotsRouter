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
            <div className='board'>
                {board}
            </div>
        );
    }
}

class BoardRow extends React.Component {
    render() {
        return (
            <div className='board-row'>
                {this.props.children}
            </div>
        )
    }
}

class Space extends React.Component {
    render() {
        const space = this.props.space;
        return (
            <div className='space'>
                {space.solid ? <Wall solid/> : null}
                {space.westWall ? <Wall west/> : null}
                {space.northWall ? <Wall north/> : null}
                {space.eastWall ? <Wall east/> : null}
                {space.southWall ? <Wall south/> : null}
            </div>
        );
    }
}

class Wall extends React.Component {
    render() {
        if (this.props.west) {
            return <div className='wall-west'/>;
        } else if (this.props.north) {
            return <div className='wall-north'/>;
        } else if (this.props.east) {
            return <div className='wall-east'/>;
        } else if (this.props.south) {
            return <div className='wall-south'/>;
        } else if (this.props.solid) {
            return <div className='wall-solid'/>;
        }
    }
}

module.exports = {
    render: (spaces) => {
        ReactDOM.render((
            <Board spaces={spaces}/>
        ), document.getElementById('app'));
    },
};
