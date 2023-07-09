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
            dragOverElement: Object,
        }
    }    

    constructor(){
        super();
        this.headerName = "Table-1";
        this.list=[];
    }

    allowDrop(e){
        e.preventDefault();
    }

    dragStart(e) {
        this.dragStartElement= e.target;
        e.dataTransfer.setData("text", e.target);
        setTimeout(() => {
            this.dragStartElement.style.opacity=0.2;
        }, 0);
    }

    drop(e) { 
        let dropzone = e.currentTarget;
        this.dragOverElement.classList.remove('active-drag-over-top');
        this.dragOverElement.classList.remove('active-drag-over-bottom');
        this.startContainer=this.dragStartElement.getAttribute("containerName");

        if(dropzone.className=="drag-container-item"){
            this.endContainer=dropzone.getAttribute("containerName");
            dropzone= this.shadowRoot.getElementById(this.endContainer);
        }
        else{
            this.endContainer=(dropzone.getAttribute("id"));
        }
        if(this.endContainer==this.startContainer){
            if(e.currentTarget.className=="drag-container-item" && e.currentTarget!=this.dragStartElement){
                let childNodes =e.currentTarget.parentNode.childNodes;
                let NextSibilingNode;
                let currentpos = 0, droppedpos = 0;
                for (let i = 0; i < childNodes.length; i++) { 
                    if (e.currentTarget == childNodes[i]) { 
                        currentpos = i; 
                        for (let j = i+1; j < childNodes.length; j++){
                            if( JSON.stringify(childNodes[j])!="{}"){
                            NextSibilingNode=childNodes[j];
                            break;
                            }
                        }
                    }
                    if (this.dragStartElement == childNodes[i]) { droppedpos = i;}
                }
                let childNodeArray = Array.from(childNodes);
                let draggedItem = this.list[childNodeArray[droppedpos].id];
                let newIndex = Number(childNodeArray[currentpos].id);
                let itemReorderEvent = new CustomEvent('item-reordered',{detail:{draggedItem:draggedItem,newIndex:newIndex},bubbles:true,composed:true});
                
                let reorderedChildNodes = this.reorderList( currentpos,droppedpos, Array.from(childNodes));
                let updatedList = this.updateDroppedList(reorderedChildNodes);
                let event = new CustomEvent('list-updated',{detail:{data:updatedList},bubbles : true, composed: true});
                this.dispatchEvent(event);
                this.dispatchEvent(itemReorderEvent); 
            }
        }
    }

    reorderList (newIndex, oldIndex, originalArray){
        let movedItem = originalArray.find((item, index) => index === oldIndex);
        let remainingItems = originalArray.filter((item, index) => index !== oldIndex);
        let reorderedItems = [
            ...remainingItems.slice(0, newIndex),
            movedItem,
            ...remainingItems.slice(newIndex)
        ];
        return reorderedItems;
    }

    updateDroppedList(listArray){
        let data = [];
        for (let i = 0; i < listArray.length; i++) { 
            if(listArray[i].className === "drag-container-item"){
                var id = listArray[i].id;
                data.push(this.list[id]);
            }
        }
        this.list = data;
        return data; 
    }


    render() {   
        return html`
            <style>
                .drag-container-item{
                    cursor: grabbing;
                    background-color:white;
                    
                }
                .active-drag-over-top{
                    /* transition-duration: 1s ; */
                    border-top:4px solid green;
                    /* padding-top: var(--fw-drag-active-padding,50px) */
                }
                .active-drag-over-bottom{
                    /* transition-duration: 1s; */
                    border-bottom:4px solid green;
                    /* padding-bottom: var(--fw-drag-active-padding,50px) */
                }
            </style>
            <div class="drag-test">
                <div class="vertical-container" id=${this.headerName}  @dragover=${(e) =>this.allowDrop(e)} >
                    ${this.list && this.list.map((item, index) => {
                        return html`
                            <div class="drag-container-item" id=${index} @dragstart=${(e) => this.dragStart(e)} containerName=${this.headerName} draggable="true"  @drop=${(e) => this.drop(e)} 
                            @dragover=${(e)=>this.handleDragOver(e)} 
                            @dragend=${(e)=> 
                                {   
                                    this.dragStartElement.style.opacity='';
                                    this.dragStartElement.style.border='';
                                    this.dragOverElement?.classList.remove('active-drag-over-top');
                                    this.dragOverElement?.classList.remove('active-drag-over-bottom');
                                }
                                }>
                                ${this.dragItemRenderer(item) }
                            </div>
                            
                        `}
                    )}
                </div>
            </div>  
        `; 
    }

    handleDragOver(e){
        
        const currentTarget = e.currentTarget;
        if(this.dragOverElement){
            this.dragOverElement.classList.remove('active-drag-over-top');
            this.dragOverElement.classList.remove('active-drag-over-bottom');
        }
        if(currentTarget==this.dragStartElement){
            
            return;
        }          
        this.dragOverElement = currentTarget;
        if(currentTarget.id < this.dragStartElement.id){
            currentTarget.classList.add('active-drag-over-top')
        }else{
            currentTarget.classList.add('active-drag-over-bottom')
        }
    }
}
window.customElements.define('drag-drop-list', DragDropList);


                    