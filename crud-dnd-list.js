import { LitElement, html } from "lit";
import "@polymer/iron-icons";
import "@polymer/paper-button";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-icon-button";
import { BoxInputStyles } from "./input-styles.js";
import { CustomDndStyles, HeaderRowStyle, ItemRowStyle} from "./styles/index.js";
// import "./drag-drop-list-animate.js";
import "./drag-drop-old.js";

export class crudDragDropList extends LitElement {
  static get properties() {
    return {
      list: Array,
      primaryAttribute: String,
      secondaryAttribute: String,
      positionAttribute: String,
      idAttribute: String,
      preventDeleteAttribute: String,
      primaryHeaderValue: String,
      secondaryHeaderValue: String,
      editable: Boolean,
      stepSize: Number,
      _addItemFieldVisible: Boolean,
      _newItemPrimaryAttribute: Boolean,
      _newItemSecondaryAttribute: Boolean,
      _editItemFieldVisible: Boolean,
      _activeItemEditsDetails: Boolean,
    };
  }
  constructor() {
    super();
    this.list = [];
    this.stepSize = 1024;
    this._addItemFieldVisible = false;
    this._editItemFieldVisible = [];
    this._activeItemEditsDetails = [];
  }

  render() {
    return html` 
    ${BoxInputStyles} ${CustomDndStyles}
      <div class="custom-dnd-list-wrapper">
        ${this.primaryHeaderValue && this.headerRow()}
        ${this.primaryAttribute && this.idAttribute
          ? html`
              ${this._addItemFieldVisible
                ? html`
                    <div class="add-input-wrapper">
                        <span class="input-fields ${this.secondaryAttribute ? "" : "grid-template-1-column"}">
                        <paper-input id="add-primary-input" class="box" .noLabelFloat=${true}
                            .value=${this._newItemPrimaryAttribute}
                            @value-changed=${(e) => { this._newItemPrimaryAttribute = e.target.value }}
                        ></paper-input>
                        ${this.secondaryAttribute ?
                            html`<paper-input class="box" .noLabelFloat=${true}
                                    .value=${this._newItemSecondaryAttribute}
                                    @value-changed=${(e) => { this._newItemSecondaryAttribute = e.target.value }}
                                ></paper-input>`:null}
                        </span>
                        <span class="add-input-actions-btn">
                        <paper-icon-button icon="check"  @tap=${() => { this.addNewItem() }}></paper-icon-button>
                        <paper-icon-button icon="cancel"
                            @tap=${() => { this._clearAddNewItemProperties() }}
                        ></paper-icon-button>
                        </span>
                    </div> `
                : null}

              <drag-drop-list
                .list=${this.list}
                .headerName=${"custom-dnd-list"}
                @item-reordered=${(e) => this.reorderItem(e.detail)}
                .dragItemRenderer=${(item) => this.renderListItem(item)}
              ></drag-drop-list>
            `:null}
      </div>`;
  }
  headerRow() {
    return html`
      ${HeaderRowStyle}
      <div style=${this.editable && this.positionAttribute? "": "padding-left:10px;width:99%;gap:5px"}
            class="header-row ${this.secondaryHeaderValue? "": "grid-template-2-column"}">
            <span>${this.primaryHeaderValue}</span> 
            ${this.secondaryHeaderValue ? html`<span class="grid-row-2-item">${this.secondaryHeaderValue}</span>`:null}
            ${this.editable
                ? html`<paper-button id="add-new-item-btn" noink raised
                    @click=${() => { this._addItemFieldVisible = true }}>
                    <iron-icon icon="add-circle-outline"></iron-icon> ADD </paper-button>`
                : null}
      </div>
    `;
  }
  renderListItem(item) {
    return html` 
    <div class="item-row-wrapper ${this.editable && this.positionAttribute? "item-bottom-border": null}">
        ${
            this.editable && this.positionAttribute ? html`<iron-icon id="drag-icon" icon="reorder"></iron-icon>`: null
        }
      <div style=${this.editable ? "" : "gap:15px;padding-left:10px;"}
        class="item-block${this.secondaryAttribute? null: " grid-template-3-column"}${!this.editable ||!this.positionAttribute? " item-bottom-border": null}"
        draggable="true" @dragstart=${(e) => { e.preventDefault(); e.stopPropagation(); }}>
        
        ${this._editItemFieldVisible?.includes(item[this.idAttribute])
          ? this._renderItemEditFields(item)
          : html` 
                <span>${item[this.primaryAttribute]}</span>
                ${this.secondaryAttribute ? html`
                <span class="grid-row-2-item">${item[this.secondaryAttribute]}</span>` :null}
                
                ${this.editable
                    ? html`
                        <paper-icon-button class="edit-btn" icon="create"
                        @tap=${() => { this._editItemFieldVisible = [...this._editItemFieldVisible,item[this.idAttribute]] }}
                        ></paper-icon-button>
                        ${item[this.preventDeleteAttribute]
                        ? html`<paper-icon-button icon="info" noink
                            class="info-btn ${this.secondaryAttribute ? "" : "grid-reposition-btn"}" 
                            @tap=${(e)=> e.target.classList.toggle('info-btn-text')}             
                            title=${this.defaultAttributeHoverMessage ? this.defaultAttributeHoverMessage(item): null}
                            ></paper-icon-button>`
                        : html`<paper-icon-button icon="delete"
                            class="delete-btn ${this.secondaryAttribute ? "": "grid-reposition-btn"}"
                            @tap=${() => { this.deleteItem(item)}}></paper-icon-button>`}
                    `: null
                 }`
         }
      </div>
    </div>`;
  }

  _renderItemEditFields(item){
    return html`
        <paper-input class="box" .noLabelFloat=${true} id="edit-input-${item[this.idAttribute]}"
        .value=${item[this.primaryAttribute]}
        @value-changed=${(e) => { this._updateActiveEdits(item[this.idAttribute],this.primaryAttribute,e.target.value);}}
        ></paper-input>
        
        ${this.secondaryAttribute ?
            html` 
            <paper-input .noLabelFloat=${true} class="box grid-row-2-item"
                .value=${item[this.secondaryAttribute]}
                @value-changed=${(e) => {this._updateActiveEdits(item[this.idAttribute],this.secondaryAttribute,e.target.value);}}
            ></paper-input>`
            :null
        }

        <paper-icon-button icon="check"
            @tap=${() => { this.updateItem(item[this.idAttribute]) }}
        ></paper-icon-button>

        <paper-icon-button icon="cancel" class="${this.secondaryAttribute ? "" : "grid-reposition-btn"}"
            @tap=${() => { this._removeItemFromActiveEdits(item[this.idAttribute]) }}
        ></paper-icon-button>
  `
  }
  updateItem(itemId) {
    let updatedDetails = this._activeItemEditsDetails.find((item) => item[this.idAttribute] === itemId);
    const initialDetails = this.list?.find((item) => item[this.idAttribute] === itemId);
    
    if (updatedDetails[this.primaryAttribute].trim() === "") 
    {
      if (typeof(initialDetails[this.preventDeleteAttribute]) === 'string')
        updatedDetails[this.primaryAttribute] =initialDetails[this.preventDeleteAttribute];
      else {
        const editInputField = this.shadowRoot.querySelector("drag-drop-list").shadowRoot.querySelector(`#edit-input-${itemId}`);
        this._displayErrorMessage(editInputField,'Required');
        return;
      }
    }else if(this._itemAlreadyExist(updatedDetails)){
        const editInputField = this.shadowRoot.querySelector("drag-drop-list").shadowRoot.querySelector(`#edit-input-${itemId}`);
        this._displayErrorMessage(editInputField,'Already Exist');
        return;
    }
    updatedDetails = { ...initialDetails, ...updatedDetails };
    this._removeItemFromActiveEdits(itemId);
    
    let updateEvent = new CustomEvent("item-updated", {
      detail: { data: { ...updatedDetails } },
      bubbles: true,composed: true,
    });
    this.dispatchEvent(updateEvent);
  }

  deleteItem(item) {
    let deleteEvent = new CustomEvent("item-deleted", {
      detail: { data: { ...item } },
      bubbles: true,composed: true,
    });
    this.dispatchEvent(deleteEvent);
  }

  addNewItem() {
    if (this._newItemPrimaryAttribute.trim() === "") {
      this._displayErrorMessage(this.shadowRoot.querySelector("#add-primary-input"),'Required');
      return;
    }
    let newItemDetails = {[this.primaryAttribute]: this._newItemPrimaryAttribute,};
    if (this.secondaryAttribute && this._newItemSecondaryAttribute.trim())
      newItemDetails[this.secondaryAttribute] = this._newItemSecondaryAttribute.trim();
    if (this.positionAttribute)
      newItemDetails[this.positionAttribute] = (this.list.at(0)?.[this.positionAttribute] || 0) - this.stepSize;

    if(this._itemAlreadyExist(newItemDetails)){
        this._displayErrorMessage(this.shadowRoot.querySelector("#add-primary-input"),'Already Exists');
        return;
    }
    let addEvent = new CustomEvent("item-added", {
      detail: { data: { ...newItemDetails } },
      bubbles: true,composed: true,
    });
    this._clearAddNewItemProperties();
    this.dispatchEvent(addEvent);
  }

  reorderItem(reorderEventDetails) {
    if (!this.editable || !this.positionAttribute) return;
    let newIndex = reorderEventDetails.newIndex;
    let updatedItem = { ...reorderEventDetails.draggedItem };
    if (newIndex == 0) 
    { updatedItem[this.positionAttribute] = this.list[newIndex][this.positionAttribute] - this.stepSize;} 
    else if (newIndex == this.list?.length - 1) {
      updatedItem[this.positionAttribute] = this.list[newIndex][this.positionAttribute] + this.stepSize;
    } else {
      updatedItem[this.positionAttribute] =
        this.list[newIndex][this.positionAttribute] > updatedItem[this.positionAttribute]
          ? (this.list[newIndex][this.positionAttribute] + this.list[newIndex + 1][this.positionAttribute]) / 2
          : (this.list[newIndex][this.positionAttribute] + this.list[newIndex - 1][this.positionAttribute]) / 2;
    }
    let positionUpdateEvent = new CustomEvent("item-updated", {
      detail: { data: { ...updatedItem } },
      bubbles: true, composed: true,
    });
    this.dispatchEvent(positionUpdateEvent);
  }

  firstUpdated() {
    const styleNode = document.createElement("style");
    const dragDropNode = this.shadowRoot.querySelector("drag-drop-list").shadowRoot;
    dragDropNode.appendChild(styleNode);
    dragDropNode.querySelector("style").insertAdjacentHTML("beforebegin", ItemRowStyle.strings[0]);
    dragDropNode.querySelector("style").insertAdjacentHTML("beforebegin", BoxInputStyles.strings[1]); 
  }

  willUpdate(changedPropertiesMap) {
    if (this.positionAttribute && changedPropertiesMap.has("list"))
      this.list.sort( (a, b) => a[this.positionAttribute] - b[this.positionAttribute]);

    if (changedPropertiesMap.has("_editItemFieldVisible") || changedPropertiesMap.has("editable"))
      this.list = [].concat(this.list);
  }

  _updateActiveEdits(itemId, editedField, newValue) {
    const itemIndex = this._activeItemEditsDetails.findIndex((item) => item[this.idAttribute] === itemId);
    if (itemIndex > -1) {
        this._activeItemEditsDetails[itemIndex][editedField] = newValue;
        return;
    }
    let editedItem = { [this.idAttribute]: itemId, [editedField]: newValue};
    this._activeItemEditsDetails.push(editedItem);
  }

  _clearAddNewItemProperties(){
    this._newItemPrimaryAttribute='';
    this._newItemSecondaryAttribute='';
    this._addItemFieldVisible=false;
  }

  _removeItemFromActiveEdits(itemId){
    const itemIndex=  this._activeItemEditsDetails.findIndex((obj) => obj[this.idAttribute] === itemId)
    this._activeItemEditsDetails.splice(itemIndex,1);
    this._editItemFieldVisible = this._editItemFieldVisible.filter((id) => id != itemId);
  }

  _itemAlreadyExist(newItem){
    return this.list.some((item)=> 
    (item[this.primaryAttribute]===newItem[this.primaryAttribute] && 
      item[this.idAttribute]!=newItem[this.idAttribute]));
  }

  _displayErrorMessage(inputElement,message){
     inputElement.invalid = true; inputElement.errorMessage = message;
     inputElement.style.margin='15px 0px'
     if(inputElement.nextSibling)
        inputElement.nextElementSibling.style.margin='15px 0px'
  }
}
window.customElements.define("crud-drag-drop-list", crudDragDropList);
