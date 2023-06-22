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
            <div style='margin:auto; width:85%'>
            <h2 style='margin-left:10px;'> Editable/ Reorderable/ Custom Tag CRUD List </h2>
                <custom-dnd-list
                .list=${this.list}
                .primaryAttribute=${'name'}
                .secondaryAttribute=${'description'}
                .uniqueIdAttribute = ${'id'}
                .positionAttribute = ${'position'}
                .primaryHeaderValue = ${'Tag Name'}
                .secondaryHeaderValue = ${'Tag Description'}
                @item-deleted=${(e)=>this.handleDelete(e.detail)}
                @item-added=${(e)=>this.handleAdd(e.detail)}
                @item-repositioned=${(e)=>this.handleReorder(e.detail)}
                @item-updated=${(e)=>this.handleUpdate(e.detail)}
                ></custom-dnd-list>
                <hr/>
                <h3>Only with .primaryAttribute & .primaryHeaderValue </h3>
                <custom-dnd-list
                .list=${this.list}
                .primaryAttribute=${'name'}
                .uniqueIdAttribute = ${'id'}
                .positionAttribute = ${'position'}
                .primaryHeaderValue = ${'Tag Name'}
                @item-deleted=${(e)=>this.handleDelete(e.detail)}
                @item-added=${(e)=>this.handleAdd(e.detail)}
                @item-repositioned=${(e)=>this.handleReorder(e.detail)}
                @item-updated=${(e)=>this.handleUpdate(e.detail)}
                ></custom-dnd-list>
                <hr/>
                <h3>Without .positionAttribute </h3>
                <h4>The Order reset to the list's order with any new addition/update</h4>
                <custom-dnd-list
                .list=${[...sampleDocumentTags]}
                .primaryAttribute=${'name'}
                .secondaryAttribute=${'description'}
                .uniqueIdAttribute = ${'id'}
                .primaryHeaderValue = ${'Tag Name'}
                @item-deleted=${(e)=>this.handleDelete(e.detail)}
                @item-added=${(e)=>this.handleAdd(e.detail)}
                @item-repositioned=${(e)=>this.handleReorder(e.detail)}
                @item-updated=${(e)=>this.handleUpdate(e.detail)}
                ></custom-dnd-list>
                <hr/>
                <h3>Without .primaryAttribute or .uniqueIdAttribute</h3>
                <h4>list not displayed as both are required</h4>
                <custom-dnd-list
                .list=${this.list}
                .positionAttribute = ${'position'}
                .primaryHeaderValue = ${'Tag Name'}
                .secondaryHeaderValue = ${'Tag Description'}
                .positionAttribute = ${'position'}
                @item-deleted=${(e)=>this.handleDelete(e.detail)}
                @item-added=${(e)=>this.handleAdd(e.detail)}
                @item-repositioned=${(e)=>this.handleReorder(e.detail)}
                @item-updated=${(e)=>this.handleUpdate(e.detail)}
                ></custom-dnd-list>
                <hr/>
                <h3>Without .primaryHeaderValue</h3>
                <custom-dnd-list
                .list=${this.list}
                .primaryAttribute=${'name'}
                .uniqueIdAttribute = ${'id'}
                .positionAttribute = ${'position'}
                @item-deleted=${(e)=>this.handleDelete(e.detail)}
                @item-added=${(e)=>this.handleAdd(e.detail)}
                @item-repositioned=${(e)=>this.handleReorder(e.detail)}
                @item-updated=${(e)=>this.handleUpdate(e.detail)}
                ></custom-dnd-list>
                <hr/>
                <h3>CSS VARIABLES Available</h3>
                <div style='display: inline-grid;
                            grid-template-columns: 1fr 1fr 1fr;
                            gap: 0px 15px;'>
                <p>--header-bottom-border-color</p>  
                <p>--header-font-size</p>
                <p>--header-border-bottom-size</p>
                <p>--header-text-color</p>
                <p>--row-item-font-size</p>
                <p>--row-item-bottom-color</p>
                <p>--border-radius</p>
                <p>--row-item-color</p>
                <p>--row-item-background</p>
                <p>--row-icons-color</p>
                <p>--item-border-bottom-size</p>
                <p>--add-button-color</p>
                <p>--add-button-background</p>
                <p>--drag-over-line-color</p>
    </div>
                
                </div>
            </div>  
        `;
    }
}
const sampleDocumentTags = [
   
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
    },
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
  ]
const singleItemList = [{
      id: "5ee9b297cc6c8cea31387c33",
      name: "VA",
      description: "Voting agreement",
      position: 1024
    }];

window.customElements.define('index-tag',IndexClass);