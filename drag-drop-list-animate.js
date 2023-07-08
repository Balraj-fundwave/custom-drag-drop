import {LitElement, html, css} from 'lit';

class DragDropList extends LitElement {

    static get styles() {
        return css`
            :host,.drag-test{
                display: block;
                height :100%;
            }
        `;
    }

    static get properties() {   
        return {
            headerName: String,
            dragStartElement:  Object,
            endContainer:  String,
            startContainer: String,
            list: Array,
            loading:Boolean
        }
    }    

    constructor(){
        super();
        this.headerName = "Table-1";
        this.list=[];
        this.loading=false;
    }

    render() {   
        return html`
            <style>
                .droppable-container{
                    
                }
                .droppable-container .draggable-item {
                    cursor: grabbing;
                    background-color:white;
                }
                .draggable-item.dragging {
                    visibility:hidden
                }
            </style>
                ${this.loading?'':
                html`
                    <div class="drag-test">
                        <div class="droppable-container" id=${this.headerName}  
                            @dragover=${(e) =>this.reorderListItems(e)} 
                            @dragenter=${(e) =>e.preventDefault()} 
                            @drop=${(e)=> this.handleDrop(e)}
                        >
                ${this.list && this.list.map((item, index) => {
                        return html`
                            <div class="draggable-item" id=${index} containerName=${this.headerName} 
                            draggable="true"  @dragstart=${(e) => this.dragStart(e)} 
                            @dragend=${(e)=> { e.currentTarget.classList.remove('dragging'); this.dragEnded(e) } }>
                                ${this.dragItemRenderer(item) }
                            </div> `})}
                        </div>
                    </div>  
                `}
                    
             
        `; 
    }

    handleDrop(e){
        e.preventDefault();
    }
    dragStart(e) {
        this.dragStartElement= e.target;
        e.dataTransfer.setData("text", e.target);
        setTimeout(() => {
            this.dragStartElement.classList.add('dragging');
        }, 0);
    }

    dragEnded(e){
        e.preventDefault();
        this.loading=true;
        this.startContainer= this.dragStartElement.getAttribute('containerName');
        this.endContainer = e.currentTarget.getAttribute('containerName');;
        if(this.startContainer !== this.endContainer){return;}
        const listArray = Array.from(e.currentTarget.parentNode.childNodes);
        const [updatedList,draggedItem,newIndex]= this.updateList(listArray);
        let itemReorderEvent = new CustomEvent('item-reordered',{detail:{draggedItem:draggedItem,newIndex:newIndex},bubbles:true,composed:true});
        let event = new CustomEvent('list-updated',{detail:{data:updatedList},bubbles : true, composed: true});
        this.list = updatedList;
        console.log(updatedList,draggedItem,newIndex)
        this.dispatchEvent(event);
        this.dispatchEvent(itemReorderEvent); 
        setTimeout(() => {  this.loading=false;}, 0);
    }
    updateList(listArray){
        let data = [];
        var draggedItem,newIndex;
        let count =0;
        for (let i = 0; i < listArray.length; i++) { 
            if(listArray[i].className === "draggable-item"){
                var id = listArray[i].id;
                if(id===this.dragStartElement.id){
                    draggedItem=this.list[id];
                    newIndex= count;
                }
                data.push(this.list[id]);
                count++;
            }
        }
        return [data,draggedItem,newIndex]
    }
    reorderListItems(e){
            e.preventDefault();
            const droppableContainer = this.shadowRoot.querySelector('.droppable-container');
            const draggingItem = this.shadowRoot.querySelector(".dragging");
            
            let siblings = [...droppableContainer.querySelectorAll(".draggable-item")];
            
            let nextSibling = siblings.find(sibling => {
                return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
            });
            droppableContainer.insertBefore(draggingItem, nextSibling);
    }
}
window.customElements.define('drag-drop-list', DragDropList);