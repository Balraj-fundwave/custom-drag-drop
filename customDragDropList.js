import {LitElement,html} from 'lit'
import '@polymer/iron-icons';
import '@polymer/paper-button';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-icon-button';
import '@polymer/paper-dialog/paper-dialog'
import  {BoxInputStyles} from './input-styles'
import {CustomDndStyles,headerRowStyle,ItemRowStyle} from './styles/index'
import './drag-drop-list'

export class CustomDndList extends LitElement{

    static get properties(){
        return {
            list: Array,
            primaryAttribute:String,
            secondaryAttribute:String,
            positionAttribute:String,
            primaryHeaderValue:String,
            secondaryHeaderValue:String,
            uniqueIdAttribute:String,

            _addTagFieldVisible:{state:true,type:Boolean},
            _newTagPrimaryAttribute:{state:true,type:String},
            _newTagSecondaryAttribute:{state:true,type:String},
            _editTagFieldVisible:{state:true,type:Array},
            _activeEditsDetails:{state:true,type:Array}
        }
    }
    constructor(){
        super();
        this._addTagFieldVisible=false;
        this._editTagFieldVisible=[];
        this._activeEditsDetails=[];
    }
    _handleActiveEdit(itemId,tagField,newValue){
        const itemIndex = this._activeEditsDetails.findIndex((item)=> item[this.uniqueIdAttribute] === itemId);
        if(itemIndex > -1){this._activeEditsDetails[itemIndex][tagField]=newValue;return;}
        let editTag = {};
        editTag[this.uniqueIdAttribute]=itemId; editTag[tagField]= newValue;
        this._activeEditsDetails.push(editTag);
    }
    handleUpdateTag(itemId){
        const updatedTag = this._activeEditsDetails.find((item)=> item[this.uniqueIdAttribute]===itemId)
        if(updatedTag[this.primaryAttribute]===''){
            const editInputField = this.shadowRoot.querySelector('drag-drop-list').shadowRoot.querySelector(`#edit-input-${itemId}`);
            editInputField.invalid=true;editInputField.placeholder='Required';
            return;
        }
        const currentTag = this.list?.find((item)=> item[this.uniqueIdAttribute] === itemId);
        updatedTag[this.positionAttribute]= currentTag[this.positionAttribute];
        this._activeEditsDetails.splice(this._activeEditsDetails.findIndex((obj)=> obj[this.uniqueIdAttribute] === itemId), 1)
        this._editTagFieldVisible = this._editTagFieldVisible.filter((id)=> id!=itemId);
        let updateEvent = new CustomEvent('item-updated',{detail:{data:updatedTag}});
        this.list= this.list?.filter((item)=> item[this.uniqueIdAttribute] !== itemId);
        this.list= [...this.list,updatedTag];
        this.dispatchEvent(updateEvent);
    }
    handleDeleteTag(item){
        let deleteEvent = new CustomEvent('item-deleted',{detail:{data:item}});
        this.list= this.list?.filter((obj)=> obj[this.uniqueIdAttribute]!==item[this.uniqueIdAttribute]);
        this.dispatchEvent(deleteEvent);
    }
    handleAddNewTag(){
        if(this._newTagPrimaryAttribute.trim()===''){
            const addPrimaryInput = this.shadowRoot.querySelector('#add-primary-input');
            addPrimaryInput.invalid=true;addPrimaryInput.placeholder='Required';
            return;
        }
        let newTagObj = {};
        newTagObj[this.primaryAttribute]= this._newTagPrimaryAttribute;
        if(this.secondaryAttribute){newTagObj[this.secondaryAttribute] = this._newTagSecondaryAttribute};

        const maxPosition = this.list.length? Math.max(...this.list.map((item)=> item[this.positionAttribute])):0;
        newTagObj[this.positionAttribute]= maxPosition + 1024;

        let addEvent= new CustomEvent('item-added',{detail:{data:newTagObj}});
        let newItemWithID = {id:`${Math.random().toString().slice(2,11)}ecbda94db4a78d`,...newTagObj};
        this.list= [...this.list, newItemWithID];
        this._newTagPrimaryAttribute='';this._newTagSecondaryAttribute='';this._addTagFieldVisible=false;
        this.dispatchEvent(addEvent);
    }
    handleReorderTag(reorderEventDetails){
        let newIndex = reorderEventDetails.newIndex;
        
        let updatedItem= {...reorderEventDetails.draggedItem};
        if(newIndex==0){updatedItem[this.positionAttribute] = this.list[newIndex][this.positionAttribute]/2;}
        else if(newIndex== this.list?.length-1){updatedItem[this.positionAttribute] = this.list[newIndex][this.positionAttribute]+ 1024;}
        else{
            updatedItem[this.positionAttribute] = this.list[newIndex][this.positionAttribute] > updatedItem[this.positionAttribute] ?
            (this.list[newIndex][this.positionAttribute] + this.list[newIndex+1][this.positionAttribute])/2 :
            (this.list[newIndex][this.positionAttribute] + this.list[newIndex-1][this.positionAttribute])/2;
        }
        let positionUpdateEvent = new CustomEvent('item-repositioned',{detail:{data:updatedItem}})
        this.list= this.list?.filter((item)=> item[this.uniqueIdAttribute]!== updatedItem[this.uniqueIdAttribute]);
        this.list= [...this.list,updatedItem];
        this.dispatchEvent(positionUpdateEvent);
    }
    render(){
        return html`
        ${BoxInputStyles}
        ${CustomDndStyles}
            <div class='tag-table-container'>
                    ${this.headerRow()}
                    <drag-drop-list
                        .list=${this.list?.sort((a,b)=> a[this.positionAttribute] -b[this.positionAttribute])}
                        .customReactiveProperties=${[this._editTagFieldVisible]}
                        .headerName=${"custom-tag-table"}
                         @item-reordered=${(e)=>this.handleReorderTag(e.detail)}
                        .dragItemRenderer=${(item)=>this.renderListItem(item)}>
                    </drag-drop-list>
                ${
                  this._addTagFieldVisible?
                  html`<div class='add-input-wrapper'>
                    <span class='input-fields'>
                        <paper-input id='add-primary-input' class='box' .value=${this._newTagPrimaryAttribute ? this._newTagPrimaryAttribute : ''} .noLabelFloat=${true}
                        @value-changed=${(e)=>{this._newTagPrimaryAttribute=e.target.value;}} class='paper-text-input' ></paper-input>
                        ${this.secondaryAttribute &&
                        html`<paper-input class='box' .value=${this._newTagSecondaryAttribute ? this._newTagSecondaryAttribute : ''}  .noLabelFloat=${true}
                        @value-changed=${(e)=>{this._newTagSecondaryAttribute=e.target.value;}} class='paper-text-input'></paper-input>`}
                    </span>
                    <span class='add-input-actions-btn'>
                        <paper-icon-button @tap=${()=>{this.handleAddNewTag();}} icon="check"></paper-icon-button>
                        <paper-icon-button @tap=${()=>{this._newTagSecondaryAttribute='';this._newTagPrimaryAttribute='';this._addTagFieldVisible=false;}} icon="cancel"></paper-icon-button>
                    </span>
                    </div>`:null}
                    <paper-button id='add-new-item' style='margin-top:15px;' noink raised @tap=${()=>{this._addTagFieldVisible=true;}}>
                    <iron-icon icon="add-circle-outline"></iron-icon>ADD</paper-button>
            </div>
            `;
    }
    headerRow(){
        return html`
            ${headerRowStyle}
        <div class="header-row">
            <span>${this.primaryHeaderValue}</span> ${this.secondaryHeaderValue &&  html `<span class='second-item'>${this.secondaryHeaderValue}</span>`}
            <span>Actions</span>
        </div>
            `;
    }
    renderListItem(item){
        return html`
        ${ItemRowStyle}
        ${BoxInputStyles}
        <div class='item-row-wrapper'>
        <iron-icon id='drag-icon' icon="reorder"></iron-icon>
        <div class='item-block' draggable='true' @dragstart=${(e)=> {e.preventDefault();e.stopPropagation();}}>
            ${
                this._editTagFieldVisible?.includes(item[this.uniqueIdAttribute])?
                html`<paper-input id='edit-input-${item[this.uniqueIdAttribute]}' class='box'  .value=${item[this.primaryAttribute]} .noLabelFloat=${true} 
                        @value-changed=${(e)=> { this._handleActiveEdit(item[this.uniqueIdAttribute],this.primaryAttribute,e.target.value) }}></paper-input>
                        ${this.secondaryAttribute && html`<paper-input .value=${item[this.secondaryAttribute]} .noLabelFloat=${true} class='box second-item'
                        @value-changed=${(e)=> {this._handleActiveEdit(item[this.uniqueIdAttribute],this.secondaryAttribute,e.target.value)}}></paper-input>`}
                        <paper-icon-button icon="check" @tap=${()=> {this.handleUpdateTag(item[this.uniqueIdAttribute]);}}></paper-icon-button>
                        <paper-icon-button icon="cancel"
                            @tap=${()=>{ this._activeEditsDetails.splice(this._activeEditsDetails.findIndex((obj)=> obj[this.uniqueIdAttribute] === item[this.uniqueIdAttribute]),1)
                                this._editTagFieldVisible = this._editTagFieldVisible.filter((id)=> id!=item[this.uniqueIdAttribute]);}} ></paper-icon-button>    `
                :html`<span>${item[this.primaryAttribute]}</span>${this.secondaryAttribute && html`<span class='second-item'>${item[this.secondaryAttribute]}</span>`}
                <paper-icon-button class='edit-btn' icon="create" @tap=${()=>{this._editTagFieldVisible = [...this._editTagFieldVisible, item[this.uniqueIdAttribute]];}}></paper-icon-button>
                <paper-icon-button class='delete-btn' icon="delete" @tap=${()=>{this.handleDeleteTag(item)}}></paper-icon-button>`}
        </div>
        </div>`;
    }
}
window.customElements.define('custom-dnd-list',CustomDndList);


// handletemp(eventDetails){
//     let updatedList = [...eventDetails.data];
//     let updateIndex ;
//     for(let i=0;i<updatedList.length;i++){
//         if( updatedList[i][this.positionAttribute] < ((i>0)?updatedList[i-1][this.positionAttribute]:-Infinity) &&
//         updatedList[i][this.positionAttribute]<((i<updatedList.length-1) ? updatedList[i+1][this.positionAttribute]:Infinity))
//             {updateIndex=i;break;}
//         if( updatedList[i][this.positionAttribute]> ((i>0)?updatedList[i-1][this.positionAttribute]:-Infinity) && 
//         updatedList[i][this.positionAttribute]>((i<updatedList.length-1) ? updatedList[i+1][this.positionAttribute]:Infinity) )
//             {updateIndex=i;break;}
//     }
//     let updatedItem = {...updatedList[updateIndex]};
//     if(updateIndex===0)
//     {   updatedItem[this.positionAttribute] = (updatedList[updateIndex+1][this.positionAttribute]/2) }
//     else if(updateIndex==updatedList.length-1)
//     {   updatedItem[this.positionAttribute] = (updatedList[updateIndex-1][this.positionAttribute] + 1024)  }
//     else
//     {
//         updatedItem[this.positionAttribute] = (updatedList[updateIndex-1][this.positionAttribute]+ updatedList[updateIndex+1][this.positionAttribute]) / 2;
//     }
//     console.log(updatedItem);
//     // this.list = this.list.filter((item)=> item[this.uniqueIdAttribute]!== updatedItem[this.uniqueIdAttribute]);
//     // console.log(updatedList.sort((a,b)=> a[this.positionAttribute]- b[this.positionAttribute]));
//     // this. list = [...this.list,updatedList]
//     // console.log(this.list);
// }