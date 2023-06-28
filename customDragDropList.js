import {LitElement,html} from 'lit'
import '@polymer/iron-icons';
import '@polymer/paper-button';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-icon-button';
import  {BoxInputStyles} from './input-styles'
import {CustomDndStyles,HeaderRowStyle,ItemRowStyle} from './styles/index'
import './drag-drop-list'

export class CustomDndList extends LitElement{

    static get properties(){
        return {
            list: Array,
            primaryAttribute: String,
            secondaryAttribute: String,
            positionAttribute: String,
            uniqueIdAttribute: String,
            defaultPrimaryAttribute: String,
            primaryHeaderValue: String,
            secondaryHeaderValue: String,
            editable: Boolean,
            _stepSize: Number,
            _addItemFieldVisible: Boolean,
            _newItemPrimaryAttribute: Boolean,
            _newItemSecondaryAttribute: Boolean,
            _editItemFieldVisible: Boolean,
            _activeItemEditDetails: Boolean,
        }
    }
    constructor(){
        super();
        this.list = [];
        this._stepSize= 1024;
        this._addItemFieldVisible=false;
        this._editItemFieldVisible=[];
        this._activeItemEditDetails=[];
    }
    _itemEditedDetailUpdate(itemId,editedField,newValue){
        const itemIndex = this._activeItemEditDetails.findIndex((item)=> item[this.uniqueIdAttribute] === itemId);
        if(itemIndex > -1){ this._activeItemEditDetails[itemIndex][editedField]=newValue; return; }
        let editedItem = { [this.uniqueIdAttribute]:itemId , [editedField]:newValue};
        this._activeItemEditDetails.push(editedItem);
    }
    updateItem(itemId){
        let updatedDetails = this._activeItemEditDetails.find((item)=> item[this.uniqueIdAttribute]===itemId)
        const initialDetails = this.list?.find((item)=> item[this.uniqueIdAttribute] === itemId);
        if(updatedDetails[this.primaryAttribute].trim()===''){
            if(initialDetails[this.defaultPrimaryAttribute]) 
                updatedDetails[this.primaryAttribute]= initialDetails[this.defaultPrimaryAttribute]
            else{
            const editInputField = this.shadowRoot.querySelector('drag-drop-list').shadowRoot.querySelector(`#edit-input-${itemId}`);
            editInputField.value=''; editInputField.invalid=true; editInputField.placeholder='Required'; return;
            }
        }
        updatedDetails = {...initialDetails,...updatedDetails};
        this._activeItemEditDetails.splice(this._activeItemEditDetails.findIndex((obj)=> obj[this.uniqueIdAttribute] === itemId), 1)
        this._editItemFieldVisible = this._editItemFieldVisible.filter((id)=> id!=itemId);
        let updateEvent = new CustomEvent('item-updated',{detail:{data:{...updatedDetails}},bubbles:true,composed:true});
        this.dispatchEvent(updateEvent);
    }
    deleteItem(item){
        let deleteEvent = new CustomEvent('item-deleted',{detail:{data:{...item}},bubbles:true,composed:true});
        this.dispatchEvent(deleteEvent);
    }
    addNewItem(){
        if(this._newItemPrimaryAttribute.trim()===''){
            const addPrimaryInput = this.shadowRoot.querySelector('#add-primary-input');
            addPrimaryInput.value=''; addPrimaryInput.invalid=true; addPrimaryInput.placeholder='Required'; return;
        }
        let newItemDetails = { [this.primaryAttribute] : this._newItemPrimaryAttribute };
        if(this.secondaryAttribute) newItemDetails[this.secondaryAttribute] = this._newItemSecondaryAttribute;
        if(this.positionAttribute)  newItemDetails[this.positionAttribute] = (this.list.at(-1)?.[this.positionAttribute] || 0) + this._stepSize;
        
        let addEvent= new CustomEvent('item-added',{detail:{data:{...newItemDetails}},bubbles:true,composed:true});
        this._newItemPrimaryAttribute='';this._newItemSecondaryAttribute='';this._addItemFieldVisible=false;
        this.dispatchEvent(addEvent);
    }
    reorderItem(reorderEventDetails){
        if(!this.positionAttribute) return;
        let newIndex = reorderEventDetails.newIndex;
        let updatedItem= {...reorderEventDetails.draggedItem};
        if(newIndex==0){ updatedItem[this.positionAttribute] = this.list[newIndex][this.positionAttribute]/2; }
        else if(newIndex== this.list?.length-1){ updatedItem[this.positionAttribute] = this.list[newIndex][this.positionAttribute]+ this._stepSize; }
        else{
            updatedItem[this.positionAttribute] = this.list[newIndex][this.positionAttribute] > updatedItem[this.positionAttribute] ?
            (this.list[newIndex][this.positionAttribute] + this.list[newIndex+1][this.positionAttribute])/2 :
            (this.list[newIndex][this.positionAttribute] + this.list[newIndex-1][this.positionAttribute])/2;
        }
        let positionUpdateEvent = new CustomEvent('item-updated',{detail:{data:{...updatedItem}},bubbles:true,composed:true});
        this.dispatchEvent(positionUpdateEvent);
    }
    firstUpdated(){
        const styleNode = document.createElement('style')
        const dragDropNode = this.shadowRoot.querySelector('drag-drop-list').shadowRoot;
        dragDropNode.appendChild(styleNode);
        dragDropNode.querySelector('style').insertAdjacentHTML('beforebegin',ItemRowStyle.strings[0])
        dragDropNode.querySelector('style').insertAdjacentHTML('beforebegin',BoxInputStyles.strings[1])
    }
    willUpdate(changedPropertiesMap){
            if(this.positionAttribute && changedPropertiesMap.has('list'))
                this.list.sort((a,b)=> a[this.positionAttribute]-b[this.positionAttribute])
    }
    render(){
        return html`
        ${BoxInputStyles}
        ${CustomDndStyles}
            <div class='custom-dnd-list-wrapper'>
                    ${this.primaryHeaderValue && this.headerRow()}
            ${this.primaryAttribute && this.uniqueIdAttribute ? 
            html`   <drag-drop-list
                        .list=${this.list}
                        .headerName=${"custom-dnd-list"}
                        @item-reordered=${(e)=>this.reorderItem(e.detail)}
                        .dragItemRenderer=${(item)=>this.renderListItem(item)}>
                    </drag-drop-list>
                ${
                  this._addItemFieldVisible?
                  html`<div class='add-input-wrapper'>
                    <span class='input-fields ${this.secondaryAttribute ?'':'grid-template-1-column'}'>
                        <paper-input id='add-primary-input' class='box' .value=${this._newItemPrimaryAttribute ? this._newItemPrimaryAttribute : ''} .noLabelFloat=${true}
                        @value-changed=${(e)=>{this._newItemPrimaryAttribute=e.target.value;}} ></paper-input>
                        ${this.secondaryAttribute &&
                        html`<paper-input class='box' .value=${this._newItemSecondaryAttribute ? this._newItemSecondaryAttribute : ''}  .noLabelFloat=${true}
                        @value-changed=${(e)=>{this._newItemSecondaryAttribute=e.target.value;}}></paper-input>`}
                    </span>
                    <span class='add-input-actions-btn'>
                        <paper-icon-button @tap=${()=>{this.addNewItem();}} icon="check"></paper-icon-button>
                        <paper-icon-button @tap=${()=>{this._newItemSecondaryAttribute='';this._newItemPrimaryAttribute='';this._addItemFieldVisible=false;}} icon="cancel"></paper-icon-button>
                    </span>
                    </div>
                `:null}
                    ${this.editable?html`<paper-button id='add-new-item-btn' style='margin-top:15px;' noink raised @tap=${()=>{this._addItemFieldVisible=true;}}>
                    <iron-icon icon="add-circle-outline"></iron-icon>ADD</paper-button>`:null}
                    `:null}
            </div>`;
    }
    headerRow(){
        return html`
            ${HeaderRowStyle}
        <div style=${this.editable && this.positionAttribute?'':'padding-left:10px;width:99%;gap:5px'} class="header-row ${this.secondaryHeaderValue?'': 'grid-template-2-column'}">
            <span>${this.primaryHeaderValue}</span> ${this.secondaryHeaderValue &&  html `<span class='grid-row-2-item'>${this.secondaryHeaderValue}</span>`}
            ${this.editable ?  html`<span style='width:70px'>Actions</span>`:null }
        </div>
            `;
    }
    renderListItem(item){
        return html`
        <div class='item-row-wrapper ${this.editable && this.positionAttribute?'item-bottom-border':null}'> 
            ${this.editable && this.positionAttribute? html`<iron-icon id='drag-icon' icon="reorder"></iron-icon>`: null}
            <div class='item-block${this.secondaryAttribute ?null:' grid-template-3-column'}${!this.editable || !this.positionAttribute?' item-bottom-border':null}' style=${this.editable?'':'gap:15px;padding-left:10px;'}
                draggable='true' @dragstart=${(e)=> {e.preventDefault();e.stopPropagation();}}>
            ${  this._editItemFieldVisible?.includes(item[this.uniqueIdAttribute])?
               html`    
                    <paper-input id='edit-input-${item[this.uniqueIdAttribute]}' class='box' .value=${item[this.primaryAttribute]} .noLabelFloat=${true} 
                        @value-changed=${(e)=> { this._itemEditedDetailUpdate(item[this.uniqueIdAttribute],this.primaryAttribute,e.target.value) }}>
                    </paper-input>
                    ${this.secondaryAttribute && html`
                        <paper-input .value=${item[this.secondaryAttribute]} .noLabelFloat=${true} class='box grid-row-2-item'
                            @value-changed=${(e)=> {this._itemEditedDetailUpdate(item[this.uniqueIdAttribute],this.secondaryAttribute,e.target.value)}}>
                        </paper-input>`}
                    <paper-icon-button icon="check" @tap=${()=> {this.updateItem(item[this.uniqueIdAttribute]);}}></paper-icon-button>
                    <paper-icon-button icon="cancel" class='${this.secondaryAttribute?'':'grid-reposition-btn'}' @tap=${()=>{ 
                            this._activeItemEditDetails.splice(this._activeItemEditDetails.findIndex((obj)=> obj[this.uniqueIdAttribute] === item[this.uniqueIdAttribute]),1)
                            this._editItemFieldVisible = this._editItemFieldVisible.filter((id)=> id!=item[this.uniqueIdAttribute]); this.shadowRoot.querySelector('drag-drop-list').requestUpdate();}}>
                    </paper-icon-button> 
                    `
                :html`  <span>${item[this.primaryAttribute]}</span> 
                        ${this.secondaryAttribute && html`<span class='grid-row-2-item'>${item[this.secondaryAttribute]}</span>`}
                        ${this.editable?
                        html`   <paper-icon-button class='edit-btn' icon="create" @tap=${()=>{
                                    this._editItemFieldVisible = [...this._editItemFieldVisible, item[this.uniqueIdAttribute]];
                                    this.shadowRoot.querySelector('drag-drop-list').requestUpdate();}}>
                                </paper-icon-button>
                                <paper-icon-button class='delete-btn ${this.secondaryAttribute?'':'grid-reposition-btn'}' @tap=${()=>{this.deleteItem(item)}} 
                                icon=${item[this.defaultPrimaryAttribute]?'error':'delete'} .disabled=${item[this.defaultPrimaryAttribute]?true:false} ></paper-icon-button>
                        `:null}`}
        </div>
        </div>`;
    }
}
window.customElements.define('custom-dnd-list',CustomDndList);