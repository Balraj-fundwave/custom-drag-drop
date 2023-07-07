import { LitElement, html } from 'lit';
import "./crud-dnd-list.js";

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
        const deletedTag = eventDetails.data;
        this.list= this.list.filter((tag)=> tag.id !== deletedTag.id);
    }
    handleAdd(eventDetails){
        console.log(eventDetails.data)
        //API CALL TO CREATE NEW TAG    //API RESPONSE with id from server
        const addedTag = eventDetails.data;
        addedTag['id']= `randomID${Math.random().toString().slice(2,11)}`
        this.list = [...this.list,addedTag];
    }
    handleUpdate(eventDetails){
        console.log(eventDetails.data)
        //API CALL TO UPDATE THE DETAILS OF THE TAG;
        const updatedTag = eventDetails.data;
        this.list = this.list.filter((tag)=> tag.id !== updatedTag.id);
        this.list = [...this.list,updatedTag]
    }
    hoverMessageForDefaultName(tag) {
        return `Maps this to ${tag.defaultName}`;
      }
    render(){
        return html`
        <style>
            .property-list{
                display:flex; flex-grow:1; gap:20px;
                flex-direction:column;
                
            }
            .property-list  div{
                grid-template-columns:1fr 1fr 1fr
            }
            @media screen and (max-width:700px){
                .property-list div{
                    flex-direction:column;
                    grid-template-columns:1fr 1fr
                }
            }
            hr{
                border-width:5px
            }
        </style>
            <div style='margin:auto; width:85%'>
            <h2 style='margin-left:10px;'> Editable/ Re-orderable/ Custom Tag CRUD List </h2>
             
                <h3>The Custom-dnd-list Element</h3>
                <crud-drag-drop-list
                .list=${this.list}
                .editable=${true}
                .stepSize=${1024}
                .defaultAttributeHoverMessage=${(tag) =>this.hoverMessageForDefaultName(tag)}
                primaryAttribute="name"
                secondaryAttribute="description"
                idAttribute="id"
                positionAttribute="position"
                preventDeleteAttribute="defaultName"
                primaryHeaderValue="Tag Name"
                secondaryHeaderValue="Tag Description"
                @item-deleted=${(e) => this.handleDelete(e.detail)}
                @item-added=${(e) => this.handleAdd(e.detail)}
                @item-updated=${(e) => this.handleUpdate(e.detail)}
                ></crud-drag-drop-list>
                
            </div>  
        `;
    }
}
const sampleDocumentTags = [
    {
      id: "62b56101904ca55d591af825",
      name: "Term Sheet",
      position: 2048
    },
      {
        id: "32rfew2f432a55d591af825",
        name: "Subscription Agreement",
        position: 5120
      },
      {
      id: "60c2075225ecbda94db4a78d",
      name: "IRA",
      description: "Investor Right Agreement",
      position: 4096
    },
    {
        id: "23rf3wf34225ecbda94db4a78d",
        name: "RoFR",
        description: "Right of First Refusal",
        position: 6144
    },
    {
        id: "5ee9b297cc6c8cea31387c33",
        name: "VA",
        description: "Voting agreement",
        position: 1024
    },
    {
        id:"7s2kjshfn39c8cea31387c33",
        name:"Notices",
        position:3072,
        defaultName:"Notices"
    },
    {
      id:"jdn372vbks87cea31387c33",
      name:"Reports",
      position:7168,
      defaultName:"Reports"
  } 
  ]
const singleItemList = [{
      id: "5ee9b297cc6c8cea31387c33",
      name: "VA",
      description: "Voting agreement",
      position: 1024
    }];

window.customElements.define('index-tag',IndexClass);