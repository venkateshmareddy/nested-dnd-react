import React from "react";
import {Droppable, Draggable} from "react-beautiful-dnd";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer userSelect: "none",
    padding: grid,
    margin: `0 0 ${grid}px 0`,

    // display: "inline-flex",
    padding: "10px",

    // change background colour if dragging
    background: isDragging
        ? "white"
        : "grey",
    // display: "inline-flex", padding: "10px", margin: "0 10px 0 0", border: "1px
    // solid grey", styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    // background: isDraggingOver ? "lightblue" : "lightgrey", padding: grid,
    // margin: "10px 0"
});

export default class ServiceCommandUnit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            childQns: this.props.children
        };
    }

    ChildQnsBuild = () => {
        return (
            <div style={{
                marginLeft: '10px'
            }}>
                <Droppable droppableId={String(this.props.type)} type={this.props.type}>
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                            {this
                                .props
                                .children
                                .map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div {...provided.dragHandleProps}>
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                                                    <p>{`${item.label}`}</p>
                                                    {item.children && <ServiceCommandUnit type={item.id} children={item.children}/>}
                                                </div>
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        )
    }
    // Normally you would want to split things out into separate components. But in
    // this example everything is just done in one place for simplicity
    render() {
        return (
            <div>
                {this.ChildQnsBuild()}
            </div>
        );
    }
}