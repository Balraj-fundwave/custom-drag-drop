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
                .primaryAttribute=${'tagname'}
                .secondaryAttribute=${'tagdesc'}
                .positionAttribute = ${'tagorder'}
                .uniqueIdAttribute = ${'identifier'}
                .primaryHeaderValue = ${'Tag Name Header'}
                .secondaryHeaderValue = ${'Tag Desscription header'}
                @item-deleted=${(e)=>this.handleDelete(e.detail)}
                @item-added=${(e)=>this.handleAdd(e.detail)}
                @item-repositioned=${(e)=>this.handleReorder(e.detail)}
                @item-updated=${(e)=>this.handleUpdate(e.detail)}
                ></custom-dnd-list>
            </div>  
        `;
    }
}
const sampleDocumentTags = [
    {
      identifier: "5ee9b297cc6c8cea31387c33",
      tagname: "VA",
      tagdesc: "Voting agreement",
      tagorder: 1024
    },
    {
      identifier: "62b56101904ca55d591af825",
      tagname: "Term Sheet",
      tagorder: 2048
    },
      {
        identifier: "32rfew2f432a55d591af825",
        tagname: "Subscription Agreement",
        tagorder: 4096
      },
      {
      identifier: "60c2075225ecbda94db4a78d",
      tagname: "IRA",
      tagdesc: "Investor Right Agreement",
      tagorder: 3072
    },
      {
        identifier: "23rf3wf34225ecbda94db4a78d",
        tagname: "RoFR",
        tagdesc: "Right of First Refusal",
        tagorder: 5120
      }
  ]
const singleItemList = [{
      identifier: "5ee9b297cc6c8cea31387c33",
      tagname: "VA",
      tagdesc: "Voting agreement",
      tagorder: 1024
    }];

window.customElements.define('index-tag',IndexClass);