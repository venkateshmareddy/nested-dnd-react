import React, {Component} from "react";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import PropTypes from 'prop-types';
import ServiceCommandUnit from "./ServiceCommandUnit";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};
const grid =8;
export default class ParentContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items:this.props.data,
            parentStyle:this.props.styleObj.parentstyling,
        };
        this.onDragEnd = this
            .onDragEnd
            .bind(this);
    }
    getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        padding: this.state.parentStyle.padding || grid,
        margin: this.state.parentStyle.margin || `0 0 ${grid}px 0`,
        // change background colour if dragging
        background: isDragging
            ? this.state.parentStyle.ondraggingBackground || "lightgreen"
            : this.state.parentStyle.background || "grey",
    
        // styles we need to apply on draggables
        ...draggableStyle
    });
    getListStyle = isDraggingOver => ({
        background: isDraggingOver
            ? this.state.parentStyle.listStyling.onDragging || "lightblue"
            : this.state.parentStyle.listStyling.background || "lightgrey",
        padding: this.state.parentStyle.padding || grid,
        width: this.state.parentStyle.listStyling.width || "100%"
    });
    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        function findObj(questions, uniqId, startIndex, endIndex) {
            let question = questions.find(i => String(i.id) === uniqId);
            if (question) {
                question.children = reorder(question.children, startIndex, endIndex)
                return 'success'
            }

            for (let item of questions.filter(i => i.children)) {
                let result = findObj(item.children, uniqId, startIndex, endIndex);
                if (result === 'success') 
                    return
            }
        }
        let questions = JSON.parse(JSON.stringify(this.state.items))
        if (result.source.droppableId === "droppable") {
            let changedObj = reorder(questions, result.source.index, result.destination.index);
            this.setState({items: changedObj},()=>{
                this.props.changedValues(this.state.items)
            })
        } else {
            findObj(questions, result.source.droppableId, result.source.index, result.destination.index)
            this.setState({items: questions},()=>{
                this.props.changedValues(this.state.items)
            })
        }
    }

    // Normally you would want to split things out into separate components. But in
    // this example everything is just done in one place for simplicity
    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable" type="parent">
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} style={this.getListStyle(snapshot.isDraggingOver)}>
                            {this
                                .state
                                .items
                                .map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div {...provided.dragHandleProps}>
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    style={this.getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                                                    {item.label}
                                                    {item.children && <ServiceCommandUnit type={item.id} children={item.children} styleObj={this.props.styleObj.childstyling}/>}
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
            </DragDropContext>
        );
    }
}

ParentContainer.propTypes={
    data:PropTypes.array,
    changedValues:PropTypes.func.isRequired
}