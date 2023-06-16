import { LitElement, html } from 'lit';
import "./customDragDropList";

export class IndexClass extends LitElement{
    static get properties(){
        return {
            list:Array
        }
    }
    constructor(){
        super();
        this.list = [...sampleDocumentTags];
    }
    //GET REQUEST TO DB TO FETCH THE TAGS
    // this.list = request response

    handleDelete(eventDetails){
        console.log(eventDetails.data)
        //API CALL TO DELETE THE ITEM
        // this.list = this.list.filter((item)=> item.id !== eventDetails.data.id);
    }
    handleAdd(eventDetails){
        console.log(eventDetails.data)
        // let newItem = eventDetails.data;
        //API CALL TO CREATE NEW TAG
        // RESPONSE OF ID
        //API RESOPNSE with id from server
        // let apiResponseObj = {id:`${Math.random().toString().slice(2,11)}ecbda94db4a78d`,...newItem};
        // this.list.push(apiResponseObj)
    }
    handleReorder(eventDetails){
        console.log(eventDetails.data)
        // let updatedTag = eventDetails.data;
        //API CALL TO UPDATE THE POSITION OF THE ITEM IN DB
        // API response 200
        // this.list = this.list.filter((item)=> item.id != updatedTag.id);
        // this.list = [...this.list,updatedTag];
    }
    handleUpdate(eventDetails){
        console.log(eventDetails.data)
        let updatedTag = eventDetails.data;
        //API CALL TO UPDATE THE DETAILS OF THE TAG;
        // this.list = this.list.filter((item)=> item.id !== updatedTag.id);
        // this.list.push(updatedTag)
    }
    render(){
        return html`
            <div>
            <h2 style='margin-left:10px;'> Editable/ Reorderable/ Custom Tag CRUD List </h2>
                <custom-dnd-list
                .list=${this.list}
                .primaryAttribute=${'name'}
                .secondaryAttribute=${'description'}
                .positionAttribute = ${'position'}
                .uniqueIdAttribute = ${'id'}
                .primaryHeaderValue = ${'Tag Name'}
                .secondaryHeaderValue = ${'Tag Description'}
                @item-deleted=${(e)=>this.handleDelete(e.detail)}
                @item-added=${(e)=>this.handleAdd(e.detail)}
                @item-repositioned=${(e)=>this.handleReorder(e.detail)}
                @item-updated=${(e)=>this.handleUpdate(e.detail)}
                ></custom-dnd-list>
                <drag-drop-list .list=${this.list} .dragItemRenderer=${(it)=>it.name}>
                </drag-drop-list>
            </div>  
        `;
    }
}
const sampleDocumentTags = [
    {
      id: "5ee9b297cc6c8cea31387c33",
      name: "VA",
      description: "Voting agreement",
      position: 1024
    },
    {
      id: "62b56101904ca55d591af825",
      name: "Term Sheet",
      position: 2048
    },
      {
        id: "32rfew2f432a55d591af825",
        name: "Subscription Agreement",
        position: 4096
      },
      {
      id: "60c2075225ecbda94db4a78d",
      name: "IRA",
      description: "Investor Right Agreement",
      position: 3072
    },
      {
        id: "23rf3wf34225ecbda94db4a78d",
        name: "RoFR",
        description: "Right of First Refusal",
        position: 5120
      }
  ]
const singleItemList = [{
      id: "5ee9b297cc6c8cea31387c33",
      name: "VA",
      description: "Voting agreement",
      position: 1024
    }];

window.customElements.define('index-tag',IndexClass);