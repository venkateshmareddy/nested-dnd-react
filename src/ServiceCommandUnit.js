import React from "react";
import {Droppable, Draggable} from "react-beautiful-dnd";

const grid = 8;

export default class ServiceCommandUnit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            childQns: this.props.children,
            padding:this.props.styleObj? this.props.styleObj.padding: grid,
            margin:this.props.styleObj? this.props.styleObj.margin: `0 0 ${grid}px 0`,
            background:this.props.styleObj? this.props.styleObj.background :"grey",
            onDragbackground:this.props.styleObj? this.props.styleObj.ondraggingBackground : "white",
            listbackground:this.props.styleObj? this.props.styleObj.listStyling.background :  "lightgrey",
            listondragbg:this.props.styleObj? this.props.styleObj.listStyling.onDragging : "lightblue",
            display:this.props.styleObj? this.props.styleObj.display : "inline-flex",
            marginfromparent:this.props.styleObj? this.props.styleObj.marginfromparent :  "10px"
        };
    }
    getItemStyle = (isDragging, draggableStyle) => {
        return ({
            padding:this.state.padding,
            margin: this.state.margin,
            display:this.state.display,
            background: isDragging  ? this.state.onDragbackground : this.state.background,
            ...draggableStyle
        })

        // ({
        
        //     // some basic styles to make the items look a bit nicer userSelect: "none",
           
        
        
        //     // change background colour if dragging
            
        //     // display: "inline-flex", padding: "10px", margin: "0 10px 0 0", border: "1px
        //     // solid grey", styles we need to apply on draggables
            
        // });
    }
    
    getListStyle = isDraggingOver => ({
        background: isDraggingOver ? this.state.listondragbg: this.state.listbackground,
        background:"none",
        //  padding: this.state.childStyle.padding,
        // margin: "10px 0"
    });
    ChildQnsBuild = () => {
        console.log(this.props.styleObj)
        return (
            <div style={{
                marginLeft:  this.state.marginfromparent
            }}>
                <Droppable droppableId={String(this.props.type)} type={this.props.type}>
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} style={this.getListStyle(snapshot.isDraggingOver)}>
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
                                                    style={this.getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                                                    <p>{`${item.label}`}</p>
                                                    {item.children && <ServiceCommandUnit type={item.id} children={item.children} styleObj={this.props.styleObj}/>}
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
                {this.props.children.length >0 && this.ChildQnsBuild()}
            </div>
        );
    }
}