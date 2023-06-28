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
        this.dragStartElement.style.opacity=0.3;
        e.dataTransfer.setData("text", e.target);
    }

    drop(e) { 
        let dropzone = e.currentTarget;dropzone.classList.remove('active-drag-over');
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
                    margin-bottom:5px;
                }
                .active-drag-over{
                    border-bottom:4px solid var(--drag-over-line-color,transparent);
                    margin-bottom:1px;
                }
            </style>
            <div class="drag-test">
                <div class="vertical-container" id=${this.headerName}  @dragover=${(e) =>this.allowDrop(e)} >
                    ${this.list && this.list.map((item, index) => {
                        return html`
                            <div class="drag-container-item" id=${index} @dragstart=${(e) => this.dragStart(e)} containerName=${this.headerName} draggable="true"  @drop=${(e) => this.drop(e)} 
                            @dragover=${(e)=>e.currentTarget.classList.add('active-drag-over')} @dragleave=${(e)=>e.currentTarget.classList.remove('active-drag-over')} @dragend=${(e)=> e.currentTarget.style.opacity=''}>
                                ${this.dragItemRenderer(item) }
                            </div>
                            
                        `}
                    )}
                </div>
            </div>  
        `; 
    }
}

window.customElements.define('drag-drop-list', DragDropList);


                    